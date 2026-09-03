const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const DASHBOARD_ROOT = __dirname;
const REPO_ROOT = path.resolve(DASHBOARD_ROOT, '..');
const PUBLIC_ROOT = path.join(DASHBOARD_ROOT, 'public');
const DATA_ROOT = process.env.CORDIALS_DATA_DIR ? path.resolve(process.env.CORDIALS_DATA_DIR) : path.join(DASHBOARD_ROOT, 'data');
const PORT = Number(process.env.CORDIALS_PORT || 4173);
const HOST = process.env.CORDIALS_HOST || '127.0.0.1';
const PRODUCT_CODES = {
  yuzu: 'YUZU', strawberry_vanilla: 'STRVAN', peach_tea_thyme: 'PECTHY',
  lychee: 'LYCH', pandan: 'PAND', mango: 'MANG', pumpkin_matcha: 'PUMPMAT',
};

function repoPath(relativePath) {
  const resolved = path.resolve(REPO_ROOT, relativePath.replaceAll('/', path.sep));
  if (!resolved.startsWith(REPO_ROOT + path.sep)) throw new Error('Path outside repository');
  return resolved;
}

function read(relativePath) {
  return fs.readFileSync(repoPath(relativePath), 'utf8').replace(/^\uFEFF/, '');
}

function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') { field += '"'; i += 1; } else quoted = !quoted;
    } else if (char === ',' && !quoted) { row.push(field); field = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[i + 1] === '\n') i += 1;
      row.push(field); field = '';
      if (row.some((value) => value !== '')) rows.push(row);
      row = [];
    } else field += char;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [headers = [], ...records] = rows;
  return records.map((values) => Object.fromEntries(headers.map((header, index) => [header.trim(), (values[index] ?? '').trim()])));
}

function clean(value) {
  return String(value || '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/\*\*|__|`/g, '')
    .replace(/<br\s*\/?>/gi, ' ')
    .trim();
}

function firstHeading(markdown) {
  return clean(markdown.match(/^#\s+(.+)$/m)?.[1] || 'Untitled');
}

function field(markdown, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = markdown.match(new RegExp(`^[-*] \\*\\*${escaped}:\\*\\*\\s*(.+)$`, 'mi'));
  return match ? clean(match[1]) : null;
}

function section(markdown, title) {
  const lines = markdown.split(/\r?\n/);
  const wanted = title.toLowerCase();
  let start = -1, level = 0;
  for (let i = 0; i < lines.length; i += 1) {
    const match = lines[i].match(/^(#{2,6})\s+(.+)$/);
    if (match && clean(match[2]).toLowerCase() === wanted) { start = i + 1; level = match[1].length; break; }
  }
  if (start < 0) return '';
  let end = lines.length;
  for (let i = start; i < lines.length; i += 1) {
    const match = lines[i].match(/^(#{1,6})\s+/);
    if (match && match[1].length <= level) { end = i; break; }
  }
  return lines.slice(start, end).join('\n').trim();
}

function paragraphs(markdownSection) {
  return markdownSection.split(/\n\s*\n/).map(clean).filter((value) => value && !value.startsWith('|'));
}

function list(markdownSection) {
  return markdownSection.split(/\r?\n/).map((line) => {
    const match = line.match(/^\s*(?:[-*]|\d+\.)\s+(.+)$/);
    return match ? clean(match[1]) : null;
  }).filter(Boolean);
}

function markdownTables(markdownSection) {
  const lines = markdownSection.split(/\r?\n/);
  const tables = [];
  for (let i = 0; i < lines.length - 1; i += 1) {
    if (!lines[i].trim().startsWith('|') || !/^\s*\|?\s*:?-{3,}/.test(lines[i + 1])) continue;
    const split = (line) => line.trim().replace(/^\||\|$/g, '').split('|').map(clean);
    const headers = split(lines[i]);
    const rows = [];
    i += 2;
    while (i < lines.length && lines[i].trim().startsWith('|')) {
      const values = split(lines[i]);
      rows.push(Object.fromEntries(headers.map((header, index) => [header, values[index] || 'UNKNOWN'])));
      i += 1;
    }
    tables.push({ headers, rows });
  }
  return tables;
}

function ids(markdown, pattern) { return [...new Set(markdown.match(pattern) || [])]; }

function normalizeProductStatus(raw, productId) {
  const value = String(raw || '').toUpperCase();
  if (productId && (value.includes('PLANNED') || value.includes('BATCH 001'))) return 'Ready to test';
  if (value.includes('APPROV')) return 'Approved';
  if (value.includes('TEST')) return 'Testing';
  if (value.includes('RESEARCH') || value.includes('VALIDATION') || value.includes('INGEST')) return 'Researching';
  if (value.includes('ARCHIV')) return 'Archived';
  return raw || 'UNKNOWN';
}

function readJsonl(filename) {
  const filePath = path.join(DATA_ROOT, filename);
  if (!fs.existsSync(filePath)) return [];
  return fs.readFileSync(filePath, 'utf8').split(/\r?\n/).filter(Boolean).map((line) => {
    try { return JSON.parse(line); } catch { return null; }
  }).filter(Boolean);
}

function appendJsonl(filename, record) {
  fs.mkdirSync(DATA_ROOT, { recursive: true });
  fs.appendFileSync(path.join(DATA_ROOT, filename), `${JSON.stringify(record)}\n`, 'utf8');
}

function makeId(prefix) {
  const stamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
  return `${prefix}-${stamp}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
}

function getSources() {
  return parseCsv(read('02_sources/bibliography.csv')).map((source) => ({
    id: source.source_id, title: source.title || 'UNKNOWN', creator: source.author_or_creator || 'UNKNOWN',
    venue: source.publisher_or_venue || 'UNKNOWN', type: source.source_type || 'UNKNOWN',
    url: source.url_or_identifier?.startsWith('http') ? source.url_or_identifier : null,
    status: source.status || 'UNKNOWN', accessedDate: source.accessed_date || 'UNKNOWN', notes: source.notes || '',
    recordPath: `02_sources/records/${source.source_id}.md`,
  }));
}

function getProfessionalRecipes(sourceMap) {
  return parseCsv(read('03_professional_recipes/recipe_index.csv')).map((record) => {
    const markdown = read(record.record_path);
    const formulationSection = section(markdown, 'Source-stated formulation') || section(markdown, 'Source formulation') || section(markdown, 'Current web formulation');
    const methodSection = section(markdown, 'Source-stated method');
    const ingredientTable = markdownTables(formulationSection)[0];
    const ingredientBullets = list(formulationSection);
    const source = sourceMap.get(record.primary_source_id);
    return {
      id: record.recipe_id, title: record.title, professional: record.professional || 'UNKNOWN', venue: record.venue || 'UNKNOWN',
      provenance: record.provenance_classification || 'UNKNOWN', sourceId: record.primary_source_id, sourceUrl: source?.url || null,
      component: record.cordial_or_component || 'Other', status: record.status || 'UNKNOWN',
      completeness: record.status.includes('QUARANTINED') ? 'Incomplete / quarantined' : record.status.includes('CONTRADICTION') || record.status.includes('CONFLICT') ? 'Complete with caveat' : 'Recorded',
      ingredients: ingredientTable ? ingredientTable.rows : ingredientBullets.map((item) => ({ Ingredient: item })),
      ingredientHeaders: ingredientTable?.headers || ['Ingredient'], method: methodSection ? list(methodSection) : [],
      warnings: list(section(markdown, 'Limitations') || section(markdown, 'Version and storage warnings') || section(markdown, 'Required contradiction note')),
      yield: field(markdown, 'Yield') || field(markdown, 'Component yield') || 'UNKNOWN', storage: field(markdown, 'Storage') || 'UNKNOWN', recordPath: record.record_path,
    };
  });
}

function getBatches() {
  return parseCsv(read('05_lab_notebook/batch_register.csv')).map((batch) => {
    const markdown = read(batch.record_path);
    const ingredients = markdownTables(section(markdown, 'Planned ingredients'))[0];
    return {
      id: batch.batch_id, productId: field(markdown, 'Parent product') || null, product: batch.cordial,
      version: batch.formulation_version, date: batch.date, provenance: batch.provenance_classification, status: batch.status,
      result: field(markdown, 'Conclusion') || 'PENDING', yieldG: batch.measured_yield_g || 'NOT MEASURED',
      yieldMl: batch.measured_yield_ml || 'NOT MEASURED', ph: batch.measured_ph || 'NOT MEASURED', brix: batch.measured_brix || 'NOT MEASURED',
      ingredients: ingredients?.rows || [], ingredientHeaders: ingredients?.headers || [], method: list(section(markdown, 'Planned method')),
      observations: { appearance: field(markdown, 'Appearance') || 'UNKNOWN', aroma: field(markdown, 'Aroma') || 'UNKNOWN', tasteTexture: field(markdown, 'Taste/texture') || 'UNKNOWN', failures: field(markdown, 'Failures/deviations') || 'UNKNOWN' },
      nextAction: field(markdown, 'Next action') || 'UNKNOWN', sourceRecipeIds: ids(markdown, /PR-\d{4}/g), testIds: ids(markdown, /AT-\d{8}-\d{3}/g), recordPath: batch.record_path,
    };
  });
}

function getTests() {
  return parseCsv(read('06_application_testing/application_test_register.csv')).map((test) => {
    const markdown = read(test.record_path);
    const formula = markdownTables(section(markdown, 'Complete drink formulation — one build'))[0];
    return {
      id: test.test_id, date: test.date, batchId: test.batch_id, product: test.cordial, productId: field(markdown, 'Parent product') || null,
      category: test.category, name: test.drink_name, doseG: test.cordial_dosage_g, doseMl: test.cordial_dosage_ml, result: test.result || 'PENDING',
      status: field(markdown, 'Test status') || test.result, provenance: field(markdown, 'Provenance') || 'UNKNOWN',
      question: field(markdown, 'Test question') || 'UNKNOWN', ingredients: formula?.rows || [], ingredientHeaders: formula?.headers || [],
      method: list(section(markdown, 'Exact preparation and build')), recordPath: test.record_path,
    };
  });
}

function getProducts(recipes, batches, tests) {
  const base = repoPath('04_round_1_development');
  return fs.readdirSync(base, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => {
    const recordPath = path.posix.join('04_round_1_development', entry.name, 'README.md');
    const markdown = read(recordPath), heading = firstHeading(markdown), productId = field(markdown, 'Product ID');
    const code = field(markdown, 'Short code') || PRODUCT_CODES[entry.name] || 'UNKNOWN';
    const name = heading.replace(/\s+[—-]\s+(PB-\d+)$/, '').replace(/\s+[—-]\s+Round 1 Development$/, '');
    const productRecipes = recipes.filter((recipe) => recipe.component.toLowerCase().includes(name.split(/[–—-]/)[0].trim().toLowerCase()) || (productId === 'PB-001' && recipe.component === 'Pumpkin'));
    const productBatches = batches.filter((batch) => batch.productId === productId || batch.product.toLowerCase().includes(name.toLowerCase()));
    const productTests = tests.filter((test) => test.productId === productId || test.product.toLowerCase().includes(name.toLowerCase()));
    const rawStatus = field(markdown, 'Current stage') || field(markdown, 'Status') || 'UNKNOWN';
    const formats = field(markdown, 'Formats') || (productId ? 'Preparation' : 'Cordial');
    const applications = field(markdown, 'Applications')?.split(';').map((value) => value.trim()).filter(Boolean) || (productId ? ['Matcha'] : []);
    const primaryUse = field(markdown, 'Primary use') || (productId ? `Iced ${name.replace(/ Matcha Sauce$/i, '').toLowerCase()} matcha` : 'Multi-category development candidate; not yet tested');
    const developmentQuestion = paragraphs(section(markdown, 'Development question'))[0] || null;
    let productBrief = markdown, overview = developmentQuestion || `Develop and validate ${name} using the repository's evidence and testing workflow.`;
    let nextAction = list(section(markdown, 'Required next steps'))[0] || paragraphs(section(markdown, 'Required next step'))[0] || 'Research and select a formulation before testing.';
    let briefPath = recordPath;
    if (productId) {
      const briefName = fs.readdirSync(path.join(base, entry.name)).find((name) => /^PB-\d{3}\.md$/i.test(name));
      briefPath = briefName ? path.posix.join('04_round_1_development', entry.name, briefName) : recordPath;
      productBrief = read(briefPath);
      overview = paragraphs(section(productBrief, 'Objective'))[0] || overview;
      const activeBatch = productBatches.find((batch) => !/SUPERSEDED|WITHDRAWN/i.test(batch.status)) || productBatches[0];
      nextAction = activeBatch?.nextAction || nextAction;
    }
    const activeBatch = productBatches.find((batch) => !/SUPERSEDED|WITHDRAWN/i.test(batch.status)) || productBatches[0];
    return {
      key: productId || entry.name, id: productId || `ROUND 1 / ${code}`, productId: productId || null, code, name,
      type: formats, status: normalizeProductStatus(rawStatus, productId), rawStatus,
      provenance: activeBatch?.provenance || 'UNKNOWN — no formulation selected', mainFlavor: name.split(/[–—-]/)[0].trim(),
      applications, currentVersion: activeBatch ? `${activeBatch.id} · ${activeBatch.version}` : 'Not selected',
      approval: 'EXPERIMENTAL — NOT YET APPROVED', overview, developmentQuestion, nextAction,
      primaryUse,
      recipeIds: [...new Set([...ids(markdown + '\n' + productBrief, /PR-\d{4}/g), ...productRecipes.map((recipe) => recipe.id)])],
      sourceIds: ids(markdown + '\n' + productBrief, /SRC-\d{4}-\d{3}/g), batchIds: productBatches.map((batch) => batch.id),
      testIds: productTests.map((test) => test.id), recordPath, briefPath, stageIndex: productId ? 3 : 1,
    };
  }).sort((a, b) => (a.productId ? -1 : 0) - (b.productId ? -1 : 0) || a.name.localeCompare(b.name));
}

function getShopping(sourceMap) {
  const latestState = new Map(readJsonl('shopping-events.jsonl').map((event) => [event.itemKey, event]));
  const sourceFor = (text) => { const sourceId = text.match(/SRC-\d{4}-\d{3}/)?.[0]; return sourceId ? sourceMap.get(sourceId) : null; };
  const makeItems = (markdown, recordPath, productLabel, keyPrefix, title, group, reasonFallback) => {
    const table = markdownTables(section(markdown, title))[0];
    return (table?.rows || []).map((row, index) => {
      const item = row.Item || 'UNKNOWN', sourceText = row['Source/price status'] || row['Current source status'] || row['Order status'] || '', source = sourceFor(sourceText);
      const itemKey = `${keyPrefix}:${title}:${index}:${item}`;
      return { itemKey, productLabel, group, item, priority: row.Priority || group, selection: row['Exact selection'] || row['Minimum needed'] || '', quantity: row.Quantity || '', reason: row['Why needed'] || row['Used for'] || row['Required PB-001 action'] || row['Check/record before test'] || reasonFallback, sourceId: source?.id || null, url: source?.url || null, sourceStatus: sourceText, state: latestState.get(itemKey)?.state || (group === 'Soon' && /ORDERED/i.test(sourceText) ? 'Ordered' : 'Need'), recordPath };
    });
  };
  const pumpkinPath = '04_round_1_development/pumpkin_matcha/shopping_list_batch_001.md', pumpkin = read(pumpkinPath);
  const optional = list(section(pumpkin, 'Optional, not a Batch 001 blocker')).map((line, index) => {
    const itemKey = `PB-001:Optional:${index}:${line.slice(0, 30)}`, sourceId = line.match(/SRC-\d{4}-\d{3}/)?.[0] || null;
    return { itemKey, productLabel: 'PB-001 / Batch 001', group: 'Optional / benchmark', item: line.split('.')[0], priority: 'OPTIONAL', selection: line, quantity: '', reason: 'Optional — not a Batch 001 blocker', sourceId, url: sourceMap.get(sourceId)?.url || null, sourceStatus: '', state: latestState.get(itemKey)?.state || 'Not needed', recordPath: pumpkinPath };
  });
  const fruitPath = '04_round_1_development/puree_matcha_batch_001_shopping.md', fruit = read(fruitPath);
  return [
    ...makeItems(pumpkin, pumpkinPath, 'PB-001 / Batch 001', 'PB-001', 'Buy', 'Need now', 'Required for PB-001 / Batch 001'),
    ...makeItems(pumpkin, pumpkinPath, 'PB-001 / Batch 001', 'PB-001', 'Confirm from existing stock', 'Need now', 'Confirm before PB-001 / Batch 001'),
    ...makeItems(pumpkin, pumpkinPath, 'PB-001 / Batch 001', 'PB-001', 'Ordered — receive and verify', 'Soon', 'Receive and verify for future work'),
    ...makeItems(fruit, fruitPath, 'PB-002 / PB-003 Batch 001', 'PB-002-003', 'Buy', 'Need now', 'Required for Lychee/Mango Batch 001'),
    ...optional,
  ];
}

function getEquipment(sourceMap) {
  return parseCsv(read('09_equipment_procurement/equipment_register.csv')).map((item) => ({
    id: item.item_id, item: item.item, available: /AVAILABLE/.test(item.requirement_status), requirementStatus: item.requirement_status,
    purpose: item.purpose, model: item.item, specification: item.specification, sourceId: item.source_id, url: sourceMap.get(item.source_id)?.url || null,
    supplier: item.supplier, price: item.price, currency: item.currency, decision: item.decision, notes: item.notes, recordPath: '09_equipment_procurement/equipment_register.csv',
  }));
}

function getQueue(products) {
  const cards = products.map((product) => ({ id: `QUEUE-${product.code}`, productId: product.productId || product.key, product: product.name, column: product.productId ? 'Ready for Test' : 'Research', task: product.productId ? 'Run Batch 001 and comparative cling pilot' : product.nextAction, blocker: product.productId ? 'Required ingredients and physical measurements pending' : 'Direct source validation / candidate selection pending', nextAction: product.nextAction }));
  const pb = read('04_round_1_development/pumpkin_matcha/PB-001.md');
  for (const row of markdownTables(section(pb, 'Pre-Batch-001 research gate'))[0]?.rows || []) {
    if (/OPEN|PENDING/i.test(row.Status)) cards.push({ id: row['Task ID'], productId: 'PB-001', product: 'Pumpkin Matcha Sauce', column: /OPEN/.test(row.Status) ? 'Research' : 'Blocked', task: row['Research task'], blocker: row.Status, nextAction: row['Completion condition'] });
  }
  return cards;
}

function buildData() {
  const sources = getSources(), sourceMap = new Map(sources.map((source) => [source.id, source]));
  const recipes = getProfessionalRecipes(sourceMap), batches = getBatches(), tests = getTests(), products = getProducts(recipes, batches, tests);
  const feedback = readJsonl('feedback.jsonl').sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const notes = readJsonl('notes.jsonl').sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const shopping = getShopping(sourceMap), equipment = getEquipment(sourceMap);
  return {
    generatedAt: new Date().toISOString(),
    summary: { products: products.length, activeDevelopment: products.filter((p) => p.status !== 'Archived').length, professionalRecipes: recipes.length, exactRecipes: recipes.filter((r) => r.provenance === 'EXACT SOURCED RECIPE').length, batches: batches.length, readyToTest: batches.filter((b) => /PLANNED/.test(b.status)).length, applicationTests: tests.length, equipment: equipment.length, approved: products.filter((p) => p.status === 'Approved').length, shoppingNeed: shopping.filter((item) => item.group === 'Need now' && !['Bought','Available','Not needed'].includes(item.state)).length, researchNeeded: products.filter((p) => p.status === 'Researching').length, feedback: feedback.length },
    products, recipes, batches, tests, sources, feedback, notes, shopping, equipment, queue: getQueue(products),
    pipeline: ['Brief', 'Research', 'Candidate', 'Batch', 'Drink Test', 'Evaluation', 'Approved'],
  };
}

function sendJson(response, status, value) {
  const body = JSON.stringify(value);
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(body), 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  response.end(body);
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => { body += chunk; if (body.length > 1_000_000) reject(new Error('Request too large')); });
    request.on('end', () => { try { resolve(JSON.parse(body || '{}')); } catch { reject(new Error('Invalid JSON')); } });
    request.on('error', reject);
  });
}

function textValue(value, max = 3000) { return typeof value === 'string' ? value.trim().slice(0, max) : ''; }

async function handleApi(request, response) {
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  if (request.method === 'GET' && url.pathname === '/api/data') return sendJson(response, 200, buildData());
  if (request.method === 'GET' && url.pathname === '/api/record') {
    const relativePath = url.searchParams.get('path') || '';
    if (!/\.(md|csv)$/i.test(relativePath)) return sendJson(response, 400, { error: 'Unsupported record type.' });
    return sendJson(response, 200, { path: relativePath, content: read(relativePath) });
  }
  if (request.method === 'POST' && url.pathname === '/api/feedback') {
    const body = await readBody(request);
    const ratings = Object.fromEntries(Object.entries(body.ratings || {}).filter(([, value]) => Number(value) >= 1 && Number(value) <= 5).map(([key, value]) => [key, Number(value)]));
    const record = { id: makeId('FB'), type: 'feedback', timestamp: new Date().toISOString(), productId: textValue(body.productId, 80) || 'GENERAL', targetId: textValue(body.targetId, 120) || null, author: ['Andreas','Huong','Other'].includes(body.author) ? body.author : 'Other', authorName: textValue(body.authorName, 120) || null, context: textValue(body.context, 80) || 'Other', ratings, tags: Array.isArray(body.tags) ? body.tags.map((tag) => textValue(tag, 80)).filter(Boolean).slice(0, 30) : [], note: textValue(body.note) };
    if (!record.note && !record.tags.length && !Object.keys(record.ratings).length) return sendJson(response, 400, { error: 'Add a note, tag, or rating.' });
    appendJsonl('feedback.jsonl', record); return sendJson(response, 201, record);
  }
  if (request.method === 'POST' && url.pathname === '/api/notes') {
    const body = await readBody(request), note = textValue(body.note);
    if (!note) return sendJson(response, 400, { error: 'A note is required.' });
    const record = { id: makeId('NOTE'), type: 'control-room-note', timestamp: new Date().toISOString(), author: textValue(body.author, 120) || 'Andreas', productId: textValue(body.productId, 80) || null, note };
    appendJsonl('notes.jsonl', record); return sendJson(response, 201, record);
  }
  if (request.method === 'POST' && url.pathname === '/api/shopping') {
    const body = await readBody(request), state = ['Need','Ordered','Bought','Available','Not needed'].includes(body.state) ? body.state : null, itemKey = textValue(body.itemKey, 500);
    if (!state || !itemKey) return sendJson(response, 400, { error: 'Valid item and state are required.' });
    const record = { id: makeId('SHOP'), type: 'shopping-state', timestamp: new Date().toISOString(), itemKey, state, author: textValue(body.author, 120) || 'Andreas' };
    appendJsonl('shopping-events.jsonl', record); return sendJson(response, 201, record);
  }
  return sendJson(response, 404, { error: 'API route not found.' });
}

function serveStatic(request, response) {
  const requested = request.url === '/' ? '/index.html' : request.url.split('?')[0];
  const safePath = path.normalize(requested).replace(/^([/\\]*\.\.[/\\])+/, '').replace(/^[/\\]+/, '');
  const filePath = path.join(PUBLIC_ROOT, safePath);
  if (!filePath.startsWith(PUBLIC_ROOT) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) { response.writeHead(404); response.end('Not found'); return; }
  const type = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png' }[path.extname(filePath)] || 'application/octet-stream';
  response.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  fs.createReadStream(filePath).pipe(response);
}

const server = http.createServer(async (request, response) => {
  try {
    if (request.url.startsWith('/api/')) return await handleApi(request, response);
    if (request.method === 'GET') return serveStatic(request, response);
    response.writeHead(405); response.end('Method not allowed');
  } catch (error) { console.error(error); sendJson(response, 500, { error: 'The repository data could not be read or updated.' }); }
});

if (require.main === module) {
  server.listen(PORT, HOST, () => console.log(`Cordials Dashboard: http://${HOST}:${PORT}`));
}

module.exports = { buildData };
