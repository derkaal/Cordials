const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const publicRoot = path.join(root, 'public');
const outputRoot = path.join(root, 'dist', 'server');
const textAsset = (name) => fs.readFileSync(path.join(publicRoot, name), 'utf8');
const binaryAsset = (name) => fs.readFileSync(path.join(publicRoot, name)).toString('base64');

const indexHtml = textAsset('index.html');
const appJs = textAsset('app.js');
const stylesCss = textAsset('styles.css');
const ogPng = binaryAsset('og.png');

const worker = `
const RAW_ROOT = 'https://raw.githubusercontent.com/derkaal/Cordials/main/';
const INDEX_HTML = ${JSON.stringify(indexHtml)};
const APP_JS = ${JSON.stringify(appJs)};
const STYLES_CSS = ${JSON.stringify(stylesCss)};
const OG_PNG_BASE64 = ${JSON.stringify(ogPng)};

function response(body, contentType, status = 200) {
  return new Response(body, { status, headers: { 'content-type': contentType, 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' } });
}

function rawUrl(relativePath) {
  return RAW_ROOT + relativePath.split('/').map(encodeURIComponent).join('/');
}

const FEEDBACK_SCHEMA = \`CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  product_id TEXT NOT NULL,
  target_id TEXT,
  author TEXT NOT NULL,
  author_name TEXT,
  context TEXT NOT NULL,
  ratings_json TEXT NOT NULL,
  tags_json TEXT NOT NULL,
  note TEXT NOT NULL
)\`;

async function ensureFeedbackDatabase(db) {
  if (!db) return false;
  await db.batch([
    db.prepare(FEEDBACK_SCHEMA),
    db.prepare('CREATE INDEX IF NOT EXISTS idx_feedback_timestamp ON feedback(timestamp DESC)'),
  ]);
  return true;
}

function textValue(value, max = 3000) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function storedFeedback(row) {
  let ratings = {}, tags = [];
  try { ratings = JSON.parse(row.ratings_json || '{}'); } catch {}
  try { tags = JSON.parse(row.tags_json || '[]'); } catch {}
  return { id:row.id, type:'feedback', timestamp:row.timestamp, productId:row.product_id, targetId:row.target_id, author:row.author, authorName:row.author_name, context:row.context, ratings, tags, note:row.note };
}

async function githubFile(relativePath) {
  return fetch(rawUrl(relativePath) + '?sites-sync=' + Date.now(), { headers: { accept: 'text/plain' }, cf: { cacheTtl: 0 } });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'GET' && url.pathname === '/api/data') {
      const upstream = await githubFile('dashboard/data-snapshot.json');
      if (!upstream.ok) return response(JSON.stringify({ error: 'The GitHub dashboard snapshot is unavailable.' }), 'application/json; charset=utf-8', 502);
      const data = await upstream.json();
      data.hostedReadOnly = true;
      data.hostedFeedbackEnabled = await ensureFeedbackDatabase(env.DB);
      if (data.hostedFeedbackEnabled) {
        const stored = await env.DB.prepare('SELECT * FROM feedback ORDER BY timestamp DESC LIMIT 500').all();
        data.feedback = [...(stored.results || []).map(storedFeedback), ...(data.feedback || [])];
        data.summary.feedback = data.feedback.length;
      }
      data.syncSource = 'https://github.com/derkaal/Cordials/tree/main';
      return response(JSON.stringify(data), 'application/json; charset=utf-8');
    }
    if (request.method === 'GET' && url.pathname === '/api/record') {
      const relativePath = url.searchParams.get('path') || '';
      if (!/^[A-Za-z0-9_./\u00C0-\u024F\u2013\u2014 -]+\.(md|csv)$/.test(relativePath) || relativePath.includes('..')) {
        return response(JSON.stringify({ error: 'Unsupported record path.' }), 'application/json; charset=utf-8', 400);
      }
      const upstream = await githubFile(relativePath);
      if (!upstream.ok) return response(JSON.stringify({ error: 'The repository record is unavailable.' }), 'application/json; charset=utf-8', 404);
      return response(JSON.stringify({ path: relativePath, content: await upstream.text() }), 'application/json; charset=utf-8');
    }
    if (request.method === 'POST' && url.pathname === '/api/feedback') {
      if (!await ensureFeedbackDatabase(env.DB)) return response(JSON.stringify({ error: 'Feedback storage is not connected.' }), 'application/json; charset=utf-8', 503);
      let body;
      try { body = await request.json(); } catch { return response(JSON.stringify({ error: 'Invalid feedback.' }), 'application/json; charset=utf-8', 400); }
      const ratings = Object.fromEntries(Object.entries(body.ratings || {}).filter(([, value]) => Number(value) >= 1 && Number(value) <= 5).map(([key, value]) => [textValue(key, 80), Number(value)]));
      const tags = Array.isArray(body.tags) ? body.tags.map((tag) => textValue(tag, 80)).filter(Boolean).slice(0, 30) : [];
      const note = textValue(body.note);
      if (!note && !tags.length && !Object.keys(ratings).length) return response(JSON.stringify({ error: 'Tap at least one observation.' }), 'application/json; charset=utf-8', 400);
      const record = {
        id: 'FB-' + crypto.randomUUID(), timestamp: new Date().toISOString(), productId: textValue(body.productId, 80) || 'GENERAL',
        targetId: textValue(body.targetId, 120) || null, author: ['Andreas','Huong','Other'].includes(body.author) ? body.author : 'Other',
        authorName: textValue(body.authorName, 120) || null, context: textValue(body.context, 80) || 'Other', ratings, tags, note,
      };
      await env.DB.prepare('INSERT INTO feedback (id, timestamp, product_id, target_id, author, author_name, context, ratings_json, tags_json, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(record.id, record.timestamp, record.productId, record.targetId, record.author, record.authorName, record.context, JSON.stringify(record.ratings), JSON.stringify(record.tags), record.note).run();
      return response(JSON.stringify(record), 'application/json; charset=utf-8', 201);
    }
    if (url.pathname.startsWith('/api/')) return response(JSON.stringify({ error: 'This hosted mirror is read-only.' }), 'application/json; charset=utf-8', 405);
    if (request.method !== 'GET' && request.method !== 'HEAD') return response('Method not allowed', 'text/plain; charset=utf-8', 405);
    if (url.pathname === '/app.js') return response(APP_JS, 'text/javascript; charset=utf-8');
    if (url.pathname === '/styles.css') return response(STYLES_CSS, 'text/css; charset=utf-8');
    if (url.pathname === '/og.png') {
      const bytes = Uint8Array.from(atob(OG_PNG_BASE64), (character) => character.charCodeAt(0));
      return response(bytes, 'image/png');
    }
    return response(INDEX_HTML, 'text/html; charset=utf-8');
  },
};
`;

fs.mkdirSync(outputRoot, { recursive: true });
fs.writeFileSync(path.join(outputRoot, 'index.js'), worker.trimStart(), 'utf8');
console.log(`Built ${path.relative(process.cwd(), path.join(outputRoot, 'index.js'))}`);
