const state = { data: null, route: 'home', params: [], filters: {}, modal: null, toast: null };
const navItems = [
  ['home', 'Control room', '⌂'], ['recipes', 'Recipe book', '◒'], ['lab', 'Lab', '◇'],
  ['feedback', 'Feedback', '✎'], ['shopping', 'Shopping', '✓'], ['equipment', 'Equipment', '⌁'],
  ['research', 'Research library', '⌕'], ['queue', 'Project queue', '▦'],
];
const statusTone = (value = '') => /APPROV|AVAILABLE|VALIDATED$/.test(value.toUpperCase()) ? 'green' : /READY|PLANNED|ORDERED|ACTIVE|TEST/.test(value.toUpperCase()) ? 'orange' : /BLOCK|FAIL|QUARANT|CONTRADICTION|CONFLICT/.test(value.toUpperCase()) ? 'red' : 'neutral';

function e(value) {
  return String(value ?? '').replace(/[&<>"]/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' })[char]);
}

function titleCase(value) { return String(value || '').replace(/[-_]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function missing(value) { return !value || /^(UNKNOWN|NOT MEASURED|NOT APPLICABLE|NONE|PENDING)$/i.test(String(value)); }
function badge(value, tone = statusTone(value)) { return `<span class="badge badge-${tone}">${e(value)}</span>`; }
function formatDate(value, time = false) {
  if (!value || value === 'UNKNOWN') return value || 'UNKNOWN';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('en-GB', time ? { dateStyle:'medium', timeStyle:'short' } : { day:'numeric', month:'short', year:'numeric' });
}
function productFor(id) { return state.data.products.find((product) => product.productId === id || product.key === id || product.id === id); }
function productName(id) { return productFor(id)?.name || id || 'General'; }
function feedbackFor(product) { return state.data.feedback.filter((item) => item.productId === product.productId || item.productId === product.key || product.batchIds.includes(item.targetId) || product.testIds.includes(item.targetId)); }
function recordButton(path, label = 'Open source record') { return path ? `<button class="text-button" data-record="${e(path)}">${e(label)} ↗</button>` : ''; }

async function api(path, options) {
  const response = await fetch(path, options);
  const value = await response.json();
  if (!response.ok) throw new Error(value.error || 'Request failed');
  return value;
}

async function reloadData() { state.data = await api('/api/data'); }

function parseRoute() {
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  state.route = parts[0] || 'home'; state.params = parts.slice(1);
}

function go(route) { location.hash = `#/${route}`; }

function shell(content, pageTitle, eyebrow, subtitle = '') {
  const detailPage = ['product','batch','test','reference'].includes(state.route);
  const nav = navItems.map(([key, label, icon]) => `<button type="button" class="${state.route === key || (['product','batch','test','reference'].includes(state.route) && ((key === 'recipes' && state.route === 'product') || (key === 'lab' && ['batch','test'].includes(state.route)) || (key === 'research' && state.route === 'reference'))) ? 'active' : ''}" data-route="${key}" aria-label="${label}"><span class="nav-icon">${icon}</span><span>${label}</span></button>`).join('');
  return `<div class="shell">
    <aside class="sidebar"><div class="brand" data-route="home"><div class="brand-mark">C</div><div><strong>Cordials</strong><span>Café laboratory</span></div></div><nav class="nav" aria-label="Main navigation">${nav}</nav><div class="sidebar-note"><span class="live-dot"></span> Repository connected<br>${state.data.summary.professionalRecipes} professional references indexed</div></aside>
    <main class="main"><header class="topbar ${detailPage ? 'compact-topbar' : ''}"><div><div class="eyebrow">${e(eyebrow)}</div>${detailPage ? '' : `<h1>${e(pageTitle)}</h1>${subtitle ? `<p>${e(subtitle)}</p>` : ''}`}</div><div class="top-actions"><button class="quiet-button" data-note>＋ Control Room Note</button><button class="primary-button" data-feedback>＋ Add Feedback</button></div></header>${content}</main>
    <div class="mobile-more"><button data-route="equipment">More sections · Equipment, Research, Queue</button></div>
  </div>${state.modal ? renderModal() : ''}${state.toast ? `<div class="toast">${e(state.toast)}</div>` : ''}`;
}

function metric(label, value, note, route, accent = '') {
  return `<button class="metric ${accent}" data-route="${route}"><span>${e(label)}</span><strong>${e(value)}</strong><small>${e(note)}</small></button>`;
}

function renderHome() {
  const d = state.data, active = d.products.find((p) => p.productId === 'PB-001') || d.products[0];
  const recent = [...d.feedback.map((item) => ({...item, eventType:'Feedback'})), ...d.notes.map((item) => ({...item, eventType:'Note'}))].sort((a,b) => b.timestamp.localeCompare(a.timestamp)).slice(0,4);
  const productPipelines = d.products.map((product) => `<button class="pipeline-row" data-route="product/${encodeURIComponent(product.key)}"><span><strong>${e(product.name)}</strong><small>${e(product.id)}</small></span><span class="mini-pipeline">${d.pipeline.map((stage,index) => `<i class="${index < product.stageIndex ? 'done' : index === product.stageIndex ? 'current' : ''}" title="${stage}"></i>`).join('')}</span><em>${e(d.pipeline[product.stageIndex])}</em></button>`).join('');
  const activity = recent.length ? recent.map((item) => `<article class="activity-item"><span class="activity-mark">${item.eventType === 'Feedback' ? '✎' : '•'}</span><div><strong>${e(item.author || 'Unknown')} · ${e(item.eventType)}</strong><p>${e(item.note || item.tags?.join(', ') || 'Rating recorded')}</p><small>${e(productName(item.productId))} · ${formatDate(item.timestamp, true)}</small></div></article>`).join('') : `<div class="empty-state compact"><strong>No dashboard feedback yet</strong><p>Repository status is current. Add the first tasting note after the physical test.</p></div>`;
  const content = `
    <section class="metric-grid overview-metrics">
      ${metric('Active development', d.summary.activeDevelopment, '1 ready for physical test', 'queue')}
      ${metric('Ready to test', d.summary.readyToTest, 'Batch 001 planned', 'lab', 'accent-orange')}
      ${metric('Research needed', d.summary.researchNeeded, 'Round 1 candidates', 'research')}
      ${metric('Shopping items', d.summary.shoppingNeed, 'Need now', 'shopping')}
      ${metric('Awaiting feedback', d.summary.applicationTests, 'Planned drink test', 'feedback')}
      ${metric('Approved recipes', d.summary.approved, 'None yet', 'recipes')}
    </section>
    <section class="feature">
      <div class="feature-head"><div><div class="eyebrow feature-eyebrow">${e(active.id)}</div><h2>${e(active.name)}</h2><p>Current development case · ${e(active.currentVersion)}</p></div>${badge('Ready for physical test','cream')}</div>
      <div class="next-action"><small>Next action</small><strong>${e(active.nextAction)}</strong></div>
      <div class="pipeline">${d.pipeline.map((stage,index) => `<div class="stage ${index < active.stageIndex ? 'done' : index === active.stageIndex ? 'current' : ''}">${e(stage)}</div>`).join('')}</div>
      <button class="feature-link" data-route="product/${encodeURIComponent(active.key)}">Open development record →</button>
    </section>
    <div class="two-column home-lower">
      <section><div class="section-title"><div><span class="kicker">Portfolio</span><h2>Development pipeline</h2></div><span>${d.products.length} products</span></div><div class="pipeline-list">${productPipelines}</div></section>
      <section><div class="section-title"><div><span class="kicker">Timeline</span><h2>Recent activity</h2></div><span>${d.feedback.length + d.notes.length} notes</span></div><div class="activity-list">${activity}</div></section>
    </div>`;
  return shell(content, 'What needs attention?', 'Home / Control Room', 'A calm view of the work moving through the café lab.');
}

function filterBar(kind) {
  if (kind === 'recipes') return `<div class="filters"><label class="search-field"><span>⌕</span><input data-filter="recipeSearch" value="${e(state.filters.recipeSearch || '')}" placeholder="Search flavour or ingredient" aria-label="Search recipes"></label><select data-filter="productType" aria-label="Product type"><option value="">All types</option>${['Cordial','Sauce','Syrup','Concentrate','Other'].map((v)=>`<option ${state.filters.productType===v?'selected':''}>${v}</option>`).join('')}</select><select data-filter="productStatus" aria-label="Status"><option value="">All statuses</option>${['Idea','Researching','Ready to test','Testing','Needs revision','Approved','Archived'].map((v)=>`<option ${state.filters.productStatus===v?'selected':''}>${v}</option>`).join('')}</select><select data-filter="productProvenance" aria-label="Provenance"><option value="">All provenance</option><option>EXACT SOURCED RECIPE</option><option>ADAPTATION OF SOURCED RECIPE</option><option>ORIGINAL EXPERIMENTAL FORMULATION</option><option value="UNKNOWN">UNKNOWN / not selected</option></select><select data-filter="productApplication" aria-label="Application"><option value="">All applications</option>${['Matcha','Tea','Coffee','Zero-proof','Cocktail','Dessert'].map((v)=>`<option ${state.filters.productApplication===v?'selected':''}>${v}</option>`).join('')}</select></div>`;
  return '';
}

function renderRecipes() {
  let products = state.data.products;
  const search = (state.filters.recipeSearch || '').toLowerCase();
  if (search) products = products.filter((p) => [p.name,p.mainFlavor,p.overview,p.recipeIds.join(' ')].join(' ').toLowerCase().includes(search));
  if (state.filters.productType) products = products.filter((p) => p.type === state.filters.productType);
  if (state.filters.productStatus) products = products.filter((p) => p.status === state.filters.productStatus);
  if (state.filters.productProvenance) products = products.filter((p) => state.filters.productProvenance === 'UNKNOWN' ? p.provenance.startsWith('UNKNOWN') : p.provenance === state.filters.productProvenance);
  if (state.filters.productApplication) products = products.filter((p) => p.applications.includes(state.filters.productApplication));
  const cards = products.map((product) => `<button class="recipe-card" data-route="product/${encodeURIComponent(product.key)}"><div class="flavour-orb flavour-${e(product.code.toLowerCase())}"><span>${e(product.name.slice(0,1))}</span></div><div class="card-top"><span class="record-id">${e(product.id)}</span>${badge(product.status)}</div><h2>${e(product.name)}</h2><p>${e(product.type)} · ${e(product.mainFlavor)}</p><dl><div><dt>Current version</dt><dd>${e(product.currentVersion)}</dd></div><div><dt>Provenance</dt><dd>${e(product.provenance)}</dd></div></dl><span class="card-link">Open recipe →</span></button>`).join('');
  const content = `${filterBar('recipes')}<div class="result-line"><span>${products.length} preparations</span><span>Repository-derived, not duplicated</span></div><section class="recipe-grid">${cards || '<div class="empty-state"><strong>No matching preparations</strong><p>Try clearing one or more filters.</p></div>'}</section><section class="reference-callout"><div><span class="kicker">Evidence stays separate</span><h2>Looking for sourced professional formulations?</h2><p>The Research Library keeps exact source recipes and quarantined leads visually separate from café production work.</p></div><button class="secondary-button" data-route="research">Browse ${state.data.recipes.length} references →</button></section>`;
  return shell(content, 'Recipe book', 'Everyday reference', 'Products, current versions, and status — ready to scan at the café.');
}

function table(headers, rows, options = {}) {
  if (!rows.length) return `<div class="empty-state compact"><strong>No records yet</strong><p>${e(options.empty || 'Nothing has been recorded in this section.')}</p></div>`;
  return `<div class="table-wrap"><table><thead><tr>${headers.map((header) => `<th>${e(header.label || header.key)}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr ${options.rowRoute ? `data-route="${options.rowRoute(row)}" class="clickable-row"` : ''}>${headers.map((header) => `<td data-label="${e(header.label || header.key)}">${header.render ? header.render(row[header.key], row) : e(row[header.key] || 'UNKNOWN')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

function ingredientTable(record) {
  const rows = record.ingredients || [];
  if (!rows.length) return `<div class="empty-state compact"><strong>No formulation selected</strong><p>The repository does not yet contain an experimental recipe for this product.</p></div>`;
  let headers = record.ingredientHeaders || Object.keys(rows[0]);
  const useful = headers.filter((header) => !/lot|notes|conversion/i.test(header));
  return table(useful.map((key) => ({key,label:key})), rows);
}

function steps(items) {
  return items?.length ? `<ol class="method-steps">${items.map((item) => `<li><span>${e(item)}</span></li>`).join('')}</ol>` : `<p class="missing-value">Not yet recorded</p>`;
}

function renderProduct() {
  const product = productFor(state.params[0]);
  if (!product) return renderNotFound('Product not found');
  const batch = state.data.batches.find((item) => product.batchIds.includes(item.id));
  const tests = state.data.tests.filter((item) => product.testIds.includes(item.id));
  const refs = state.data.recipes.filter((item) => product.recipeIds.includes(item.id));
  const feedback = feedbackFor(product);
  const timeline = [
    { date:'2026-08-30', label:'Product brief', text: product.productId ? 'PB-001 opened with cold-glass cling and matcha requirements.' : 'Round 1 development candidate recorded.', tone:'neutral' },
    ...refs.slice(0,4).map((ref) => ({ date:'Research', label:ref.id, text:`${ref.title} · ${ref.status}`, tone:statusTone(ref.status) })),
    ...(batch ? [{ date:batch.date,label:batch.id,text:`${batch.version} · ${batch.status}`,tone:'orange' }] : []),
    ...tests.map((test) => ({ date:test.date,label:test.id,text:`${test.name} · ${test.status}`,tone:'orange' })),
    ...feedback.map((item) => ({ date:formatDate(item.timestamp,true), label:`Feedback · ${item.author}`, text:item.note || item.tags.join(', '), tone:'green' })),
  ];
  const testCards = tests.length ? tests.map((test) => `<button class="application-card" data-route="test/${encodeURIComponent(test.id)}"><div><span class="record-id">${e(test.id)}</span><h3>${e(test.name)}</h3><p>${e(test.category)} · ${e(test.doseG)} g sauce</p></div>${badge(test.result)}</button>`).join('') : `<div class="empty-state compact"><strong>Not yet tested</strong><p>No drink application has been recorded for this product.</p></div>`;
  const referenceCards = refs.length ? refs.map((ref) => `<button class="source-card" data-route="reference/${ref.id}"><div><span>${e(ref.id)}</span><h3>${e(ref.title)}</h3><p>${e(ref.professional)} · ${e(ref.venue)}</p></div>${badge(ref.provenance, ref.provenance === 'EXACT SOURCED RECIPE' ? 'blue' : 'neutral')}</button>`).join('') : `<div class="empty-state compact"><strong>Research linkage not yet selected</strong><p>Source records will appear here when a formulation is chosen.</p></div>`;
  const measurements = batch ? [['Yield', batch.yieldG === 'NOT MEASURED' ? batch.yieldMl : `${batch.yieldG} g`],['pH',batch.ph],['°Brix',batch.brix],['Appearance',batch.observations.appearance],['Aroma',batch.observations.aroma],['Taste / texture',batch.observations.tasteTexture]] : [];
  const content = `
    <div class="detail-hero"><button class="back-link" data-route="recipes">← Recipe book</button><div class="detail-heading"><div><span class="record-id">${e(product.id)}</span><h2>${e(product.name)}</h2><p>${e(product.type)} · ${e(product.primaryUse)}</p></div><div class="detail-actions">${badge(product.status)}<button class="primary-button" data-feedback="${e(product.key)}">＋ Add Feedback</button></div></div><div class="approval-banner approval-experimental"><strong>${e(product.approval)}</strong><span>Recorded formulations and tests do not imply production or shelf-life approval.</span></div></div>
    <nav class="anchor-nav"><a href="#overview">Overview</a><a href="#recipe">Recipe</a><a href="#provenance">Source & Provenance</a><a href="#history">Development History</a><a href="#tests">Test Results</a><a href="#applications">Applications</a></nav>
    <section id="overview" class="detail-section"><div class="section-title"><div><span class="kicker">Purpose</span><h2>Overview</h2></div>${recordButton(product.briefPath,'Open complete brief')}</div><div class="overview-grid"><article class="prose-card wide"><h3>What it is</h3><p>${e(product.overview)}</p></article><article class="fact-card"><span>Status</span><strong>${e(product.status)}</strong><small>${e(product.rawStatus)}</small></article><article class="fact-card"><span>Current recommendation</span><strong>${e(product.currentVersion)}</strong><small>${e(product.nextAction)}</small></article><article class="fact-card"><span>Primary use</span><strong>${e(product.primaryUse)}</strong><small>${missing(product.primaryUse) ? 'Not yet tested' : 'Validation status shown below'}</small></article></div></section>
    <section id="recipe" class="detail-section"><div class="section-title"><div><span class="kicker">Current formulation</span><h2>${batch ? `${e(batch.version)} · Batch 001` : 'Recipe not yet selected'}</h2></div>${batch ? recordButton(batch.recordPath,'Open laboratory record') : ''}</div>${batch ? `<div class="recipe-layout"><div><div class="classification-strip">${badge(batch.provenance,'orange')}<span>${e(batch.status)}</span></div>${ingredientTable(batch)}</div><aside class="recipe-facts"><div><span>Yield</span><strong>${e(batch.yieldMl)}</strong></div><div><span>Dose</span><strong>${tests[0] ? `${e(tests[0].doseG)} g` : 'Not yet tested'}</strong></div><div><span>Storage status</span><strong>Same-day development handling only</strong></div><div><span>Equipment</span><strong>Small saucepan; scale; thermometer; refractometer pending calibration</strong></div></aside></div><h3 class="subheading">Method</h3>${steps(batch.method)}` : ingredientTable({ingredients:[]})}</section>
    <section id="provenance" class="detail-section"><div class="section-title"><div><span class="kicker">Evidence</span><h2>Source & provenance</h2></div></div><div class="source-list">${referenceCards}</div><div class="caveat"><strong>Classification boundary</strong><p>${e(product.provenance)}. Exact professional references remain separate from our candidate or experimental formulation. UNKNOWN values have not been filled by inference.</p></div></section>
    <section id="history" class="detail-section"><div class="section-title"><div><span class="kicker">Lineage</span><h2>Development history</h2></div><span>${timeline.length} linked events</span></div><div class="timeline">${timeline.map((item) => `<article><i class="timeline-dot dot-${item.tone}"></i><time>${e(item.date)}</time><div><strong>${e(item.label)}</strong><p>${e(item.text)}</p></div></article>`).join('')}</div></section>
    <section id="tests" class="detail-section"><div class="section-title"><div><span class="kicker">Measurements</span><h2>Test results</h2></div></div>${batch ? `<div class="measure-grid">${measurements.map(([label,value]) => `<article class="measurement ${missing(value) ? 'missing' : ''}"><span>${e(label)}</span><strong>${e(value)}</strong></article>`).join('')}</div>` : `<div class="empty-state"><strong>Not yet tested</strong><p>No experimental batch or measurements exist for this product.</p></div>`}</section>
    <section id="applications" class="detail-section"><div class="section-title"><div><span class="kicker">Drinks</span><h2>Applications</h2></div></div><div class="application-list">${testCards}</div></section>`;
  return shell(content, product.name, `Recipe / ${product.id}`, product.nextAction);
}

function renderLab() {
  let batches = [...state.data.batches];
  if (state.filters.batchStatus) batches = batches.filter((batch) => batch.status.toUpperCase().includes(state.filters.batchStatus));
  if (state.filters.batchProduct) batches = batches.filter((batch) => batch.productId === state.filters.batchProduct);
  const sortKey = state.filters.batchSort || 'date';
  batches.sort((a,b) => String(a[sortKey] || '').localeCompare(String(b[sortKey] || '')) * (sortKey === 'date' ? -1 : 1));
  const tests = state.data.tests;
  const content = `<div class="lab-summary"><div><span class="kicker">Permanent records</span><strong>${batches.length}</strong><p>Experimental batch${batches.length === 1 ? '' : 'es'}</p></div><div><span class="kicker">Application tests</span><strong>${tests.length}</strong><p>Planned or completed drink tests</p></div><div class="lab-principle"><strong>Failures remain visible.</strong><p>Every batch is development history. Nothing is automatically promoted to approved.</p></div></div>
    <section class="detail-section first"><div class="section-title lab-title"><div><span class="kicker">Sortable register</span><h2>Experimental batches</h2></div><div class="inline-filters"><select data-filter="batchProduct" aria-label="Filter batches by product"><option value="">All products</option>${state.data.products.filter((p)=>p.productId).map((p)=>`<option value="${e(p.productId)}" ${state.filters.batchProduct===p.productId?'selected':''}>${e(p.name)}</option>`).join('')}</select><select data-filter="batchStatus" aria-label="Filter batches by status"><option value="">All statuses</option>${['PLANNED','COMPLETE','FAILED'].map((v)=>`<option ${state.filters.batchStatus===v?'selected':''}>${v}</option>`).join('')}</select><select data-filter="batchSort" aria-label="Sort batches"><option value="date">Newest date</option><option value="id" ${state.filters.batchSort==='id'?'selected':''}>Batch ID</option><option value="product" ${state.filters.batchSort==='product'?'selected':''}>Product</option><option value="status" ${state.filters.batchSort==='status'?'selected':''}>Status</option></select></div></div>${table([
      {key:'id',label:'Batch ID'},{key:'product',label:'Product'},{key:'version',label:'Version'},{key:'date',label:'Date'},{key:'provenance',label:'Classification',render:(v)=>badge(v,'orange')},{key:'result',label:'Result'},{key:'yieldMl',label:'Yield'},{key:'ph',label:'pH'},{key:'brix',label:'°Brix'},{key:'status',label:'Status',render:(v)=>badge(v)}
    ], batches, {rowRoute:(row)=>`batch/${encodeURIComponent(row.id)}`})}</section>
    <section class="detail-section"><div class="section-title"><div><span class="kicker">Drink builds</span><h2>Application tests</h2></div></div>${table([{key:'id',label:'Test ID'},{key:'name',label:'Drink'},{key:'category',label:'Category'},{key:'batchId',label:'Batch'},{key:'doseG',label:'Dose (g)'},{key:'result',label:'Result',render:(v)=>badge(v)}], tests,{rowRoute:(row)=>`test/${encodeURIComponent(row.id)}`})}</section>`;
  return shell(content, 'Lab notebook', 'Experiments / Permanent record', 'Planned, successful, and failed batches stay visible together.');
}

function detailFacts(entries) { return `<div class="measure-grid">${entries.map(([label,value])=>`<article class="measurement ${missing(value)?'missing':''}"><span>${e(label)}</span><strong>${e(value)}</strong></article>`).join('')}</div>`; }

function renderBatch() {
  const batch = state.data.batches.find((item) => item.id === state.params[0]);
  if (!batch) return renderNotFound('Batch not found');
  const content = `<button class="back-link" data-route="lab">← Lab notebook</button><div class="detail-heading record-detail"><div><span class="record-id">${e(batch.id)}</span><h2>${e(batch.product)}</h2><p>${e(batch.version)} · ${formatDate(batch.date)}</p></div><div>${badge(batch.status)}<button class="primary-button" data-feedback="${e(batch.productId)}" data-target="${e(batch.id)}">＋ Add Feedback</button></div></div><div class="approval-banner approval-experimental"><strong>EXPERIMENTAL — NOT YET APPROVED</strong><span>${e(batch.provenance)}</span></div>
    <section class="detail-section first"><div class="section-title"><div><span class="kicker">Recorded values only</span><h2>Measurements</h2></div>${recordButton(batch.recordPath,'Open complete batch record')}</div>${detailFacts([['Result',batch.result],['Yield (g)',batch.yieldG],['Yield (ml)',batch.yieldMl],['pH',batch.ph],['°Brix',batch.brix],['Appearance',batch.observations.appearance],['Aroma',batch.observations.aroma],['Taste / texture',batch.observations.tasteTexture],['Failures / deviations',batch.observations.failures]])}</section>
    <section class="detail-section"><div class="section-title"><div><span class="kicker">Formulation</span><h2>Planned ingredients</h2></div></div>${ingredientTable(batch)}<h3 class="subheading">Planned method</h3>${steps(batch.method)}</section><section class="detail-section"><div class="next-card"><span>Next action</span><strong>${e(batch.nextAction)}</strong></div></section>`;
  return shell(content, batch.id, 'Lab / Batch record', batch.status);
}

function renderTest() {
  const test = state.data.tests.find((item) => item.id === state.params[0]);
  if (!test) return renderNotFound('Test not found');
  const content = `<button class="back-link" data-route="lab">← Lab notebook</button><div class="detail-heading record-detail"><div><span class="record-id">${e(test.id)}</span><h2>${e(test.name)}</h2><p>${e(test.category)} · ${e(test.batchId)}</p></div><div>${badge(test.status)}<button class="primary-button" data-feedback="${e(test.productId)}" data-target="${e(test.id)}">＋ Add Feedback</button></div></div><div class="approval-banner approval-experimental"><strong>${e(test.provenance)}</strong><span>This drink build is experimental, not a sourced or approved café recipe.</span></div>
    <section class="detail-section first"><article class="prose-card"><span class="kicker">Test question</span><p>${e(test.question)}</p></article>${detailFacts([['Result',test.result],['Sauce dose',`${test.doseG} g`],['Execution','Not yet tested'],['Date planned',test.date]])}</section><section class="detail-section"><div class="section-title"><div><span class="kicker">One build</span><h2>Drink formulation</h2></div>${recordButton(test.recordPath,'Open complete test record')}</div>${ingredientTable(test)}<h3 class="subheading">Exact build method</h3>${steps(test.method)}</section>`;
  return shell(content, test.name, 'Testing / Application', test.status);
}

function renderFeedback() {
  const feedback = state.data.feedback;
  const cards = feedback.length ? feedback.map((item)=>`<article class="feedback-card"><div class="feedback-meta"><span class="avatar">${e((item.authorName || item.author || '?')[0])}</span><div><strong>${e(item.authorName || item.author)}</strong><small>${e(productName(item.productId))} · ${e(item.context)} · ${formatDate(item.timestamp,true)}</small></div>${item.targetId ? `<span class="record-id">${e(item.targetId)}</span>` : ''}</div>${item.tags?.length ? `<div class="tag-row">${item.tags.map((tag)=>`<span>${e(tag)}</span>`).join('')}</div>`:''}${item.note ? `<blockquote>${e(item.note)}</blockquote>`:''}${Object.keys(item.ratings||{}).length ? `<div class="rating-summary">${Object.entries(item.ratings).map(([key,value])=>`<span>${e(titleCase(key))} <strong>${value}/5</strong></span>`).join('')}</div>`:''}</article>`).join('') : `<div class="empty-state"><div class="empty-icon">✎</div><strong>No feedback recorded yet</strong><p>Add a tasting, service, or visual observation. It will be stored as an append-only repository record.</p><button class="primary-button" data-feedback>＋ Add first feedback</button></div>`;
  const content = `<div class="feedback-intro"><div><strong>Fast enough for the café</strong><p>Ratings are optional. A tag and a short note are enough.</p></div><button class="primary-button large" data-feedback>＋ Add Feedback</button></div><section class="feedback-list">${cards}</section>`;
  return shell(content, 'Testing & feedback', 'Observe / Record / Decide', 'Feedback adds evidence to the timeline; it never rewrites a historical recipe.');
}

function renderShopping() {
  const groups = ['Need now','Soon','Optional / benchmark'];
  const groupHtml = groups.map((group) => {
    const items = state.data.shopping.filter((item) => item.group === group);
    return `<section class="shopping-group"><div class="section-title"><div><span class="kicker">${group === 'Need now' ? 'Required for authorised work' : group === 'Soon' ? 'Upcoming work' : 'Controls and alternatives'}</span><h2>${group}</h2></div><span>${items.length} items</span></div><div class="shopping-list">${items.map((item)=>`<article class="shopping-item ${['Bought','Available','Not needed'].includes(item.state)?'resolved':''}"><select class="state-select state-${e(item.state.toLowerCase().replace(' ', '-'))}" data-shopping="${e(item.itemKey)}" aria-label="Shopping state for ${e(item.item)}">${['Need','Ordered','Bought','Available','Not needed'].map((value)=>`<option ${item.state===value?'selected':''}>${value}</option>`).join('')}</select><div><div class="shopping-title"><h3>${e(item.item)}</h3>${item.priority ? badge(item.priority,item.group==='Need now'?'orange':'neutral'):''}</div>${item.selection ? `<p>${e(item.selection)}</p>`:''}<small><strong>Needed for:</strong> PB-001 / Batch 001 · ${e(item.reason)}</small>${item.sourceStatus ? `<small>${e(item.sourceStatus)}</small>`:''}</div>${item.url ? `<a class="purchase-link" href="${e(item.url)}" target="_blank" rel="noreferrer">Purchase source ↗</a>`:''}</article>`).join('')}</div></section>`;
  }).join('');
  return shell(groupHtml, 'Shopping', 'Procurement / Readiness', `${state.data.summary.shoppingNeed} items still needed for the next authorised experiment.`);
}

function renderEquipment() {
  const cards = state.data.equipment.map((item)=>`<article class="equipment-card"><div class="equipment-icon">${item.available?'✓':'⌛'}</div><div class="equipment-main"><div class="card-top"><span class="record-id">${e(item.id)}</span>${badge(item.requirementStatus)}</div><h2>${e(item.item)}</h2><p>${e(item.purpose)}</p><dl><div><dt>Specification</dt><dd>${e(item.specification)}</dd></div><div><dt>Status</dt><dd>${e(item.decision)}</dd></div><div><dt>Notes</dt><dd>${e(item.notes)}</dd></div></dl><div class="card-footer">${item.url?`<a href="${e(item.url)}" target="_blank" rel="noreferrer">Source ↗</a>`:''}${recordButton(item.recordPath,'Open register')}</div></div></article>`).join('');
  return shell(`<div class="equipment-summary"><div><strong>${state.data.equipment.filter((i)=>i.available).length}</strong><span>Available</span></div><div><strong>${state.data.equipment.filter((i)=>!i.available).length}</strong><span>Ordered / pending</span></div><p>Availability is explicit. Calibration and receipt checks remain visible.</p></div><section class="equipment-grid">${cards}</section>`, 'Equipment', 'Tools / Availability', 'What is owned, ordered, and still awaiting verification.');
}

function renderResearch() {
  let recipes = state.data.recipes;
  const q = (state.filters.researchSearch || '').toLowerCase(), mode = state.filters.researchMode || 'all';
  if (q) recipes = recipes.filter((r)=>[r.id,r.title,r.professional,r.venue,r.component].join(' ').toLowerCase().includes(q));
  if (mode === 'exact') recipes = recipes.filter((r)=>r.provenance==='EXACT SOURCED RECIPE');
  if (mode === 'quarantine') recipes = recipes.filter((r)=>r.status.includes('QUARANTINED'));
  const cards = recipes.map((recipe)=>`<button class="research-card" data-route="reference/${recipe.id}"><div class="card-top"><span class="record-id">${e(recipe.id)}</span>${badge(recipe.completeness)}</div><h2>${e(recipe.title)}</h2><p>${e(recipe.professional)} · ${e(recipe.venue)}</p><div class="research-meta"><span>${e(recipe.component)}</span><span>${e(recipe.provenance)}</span></div><span class="card-link">Inspect formulation →</span></button>`).join('');
  const content = `<div class="filters research-filters"><label class="search-field"><span>⌕</span><input data-filter="researchSearch" value="${e(state.filters.researchSearch||'')}" placeholder="Search recipe, professional, venue" aria-label="Search research"></label><div class="segmented"><button data-research-mode="all" class="${mode==='all'?'active':''}">All ${state.data.recipes.length}</button><button data-research-mode="exact" class="${mode==='exact'?'active':''}">Exact ${state.data.summary.exactRecipes}</button><button data-research-mode="quarantine" class="${mode==='quarantine'?'active':''}">Quarantined</button></div></div><div class="research-notice"><strong>Evidence and comparison — not café production</strong><p>Adaptations are never presented as exact sourced recipes. Incomplete and contradictory records remain clearly marked.</p></div><section class="research-grid">${cards}</section>`;
  return shell(content, 'Research library', 'Professional formulations', 'Verified recipes, incomplete leads, methods, creators, and primary source links.');
}

function renderReference() {
  const recipe = state.data.recipes.find((item)=>item.id===state.params[0]);
  if (!recipe) return renderNotFound('Reference not found');
  const source = state.data.sources.find((item)=>item.id===recipe.sourceId);
  const content = `<button class="back-link" data-route="research">← Research library</button><div class="detail-heading record-detail"><div><span class="record-id">${e(recipe.id)}</span><h2>${e(recipe.title)}</h2><p>${e(recipe.professional)} · ${e(recipe.venue)}</p></div><div>${badge(recipe.provenance,recipe.provenance==='EXACT SOURCED RECIPE'?'blue':'red')}</div></div><div class="approval-banner approval-reference"><strong>EXACT PROFESSIONAL REFERENCE / RESEARCH RECORD</strong><span>This source is for evidence and comparison. It is not automatically a café production recipe.</span></div>
    <section class="detail-section first"><div class="overview-grid"><article class="fact-card"><span>Source status</span><strong>${e(recipe.status)}</strong><small>${e(recipe.completeness)}</small></article><article class="fact-card"><span>Creator</span><strong>${e(recipe.professional)}</strong><small>${e(recipe.venue)}</small></article><article class="fact-card"><span>Yield</span><strong>${e(recipe.yield)}</strong><small>Missing values remain explicit</small></article><article class="fact-card"><span>Storage</span><strong>${e(recipe.storage)}</strong><small>Source-stated only; not safety validation</small></article></div></section>
    <section class="detail-section"><div class="section-title"><div><span class="kicker">As published</span><h2>Source formulation</h2></div>${recordButton(recipe.recordPath,'Open complete reference')}</div>${ingredientTable(recipe)}${recipe.method.length?`<h3 class="subheading">Method</h3>${steps(recipe.method)}`:''}</section>
    <section class="detail-section"><div class="section-title"><div><span class="kicker">Provenance</span><h2>Source details</h2></div></div><div class="source-panel"><dl><div><dt>Source ID</dt><dd>${e(recipe.sourceId)}</dd></div><div><dt>Publisher / venue</dt><dd>${e(source?.venue||recipe.venue)}</dd></div><div><dt>Source type</dt><dd>${e(source?.type||'UNKNOWN')}</dd></div><div><dt>Accessed</dt><dd>${e(source?.accessedDate||'UNKNOWN')}</dd></div></dl>${recipe.sourceUrl?`<a class="primary-button" href="${e(recipe.sourceUrl)}" target="_blank" rel="noreferrer">Open source website ↗</a>`:''}</div>${recipe.warnings.length?`<div class="caveat danger"><strong>Caveats / contradictions</strong><ul>${recipe.warnings.map((warning)=>`<li>${e(warning)}</li>`).join('')}</ul></div>`:''}</section>`;
  return shell(content, recipe.title, `Research / ${recipe.id}`, recipe.provenance);
}

function renderQueue() {
  const columns = ['Ideas','Research','Ready for Test','Testing','Needs Decision','Approved','Blocked'];
  const boards = columns.map((column)=>{ const cards=state.data.queue.filter((item)=>item.column===column); return `<section class="kanban-column"><header><h2>${column}</h2><span>${cards.length}</span></header><div>${cards.length?cards.map((card)=>`<button class="queue-card" data-route="product/${encodeURIComponent(card.productId)}"><span class="record-id">${e(card.id)}</span><h3>${e(card.product)}</h3><p>${e(card.task)}</p>${card.blocker?`<small><strong>Blocker</strong>${e(card.blocker)}</small>`:''}<em>${e(card.nextAction)} →</em></button>`).join(''):`<div class="kanban-empty">No items</div>`}</div></section>`;}).join('');
  return shell(`<div class="queue-summary"><strong>${state.data.queue.length} current tasks</strong><p>Cards are derived from product status and the PB-001 research gate. Approved remains empty until evidence supports it.</p></div><div class="kanban">${boards}</div>`, 'Project queue', 'Now / Next / Blocked', 'A compact view of what should happen next across the portfolio.');
}

function renderNotFound(message) { return shell(`<div class="empty-state"><strong>${e(message)}</strong><button class="secondary-button" data-route="home">Return to Control Room</button></div>`, 'Not found', 'Cordials'); }

function renderModal() {
  if (state.modal.type === 'feedback') return feedbackModal();
  if (state.modal.type === 'note') return noteModal();
  if (state.modal.type === 'record') return recordModal();
  return '';
}

function feedbackModal() {
  const selected = productFor(state.modal.productId) || state.data.products[0];
  const target = state.modal.targetId || selected.batchIds[0] || '';
  const targets = ['',...selected.batchIds,...selected.testIds].map((id)=>`<option value="${e(id)}" ${target===id?'selected':''}>${id?e(id):'Product overall'}</option>`).join('');
  const baseTags = ['Too sweet','Not sweet enough','Too acidic','Too weak','Too strong','Too thin','Too thick','Runs down glass','Good cling','Separates','Difficult to serve','Looks good','Would serve again'];
  const productTags = selected.productId==='PB-001'?['Matcha disappears','Pumpkin too weak','Pumpkin too strong']:[];
  const ratingFields = ['flavour','sweetness','acidity','aroma','texture','visual appearance','ease of service','overall'];
  return `<div class="modal-backdrop" data-close><section class="modal-sheet" role="dialog" aria-modal="true" aria-labelledby="feedback-title" data-modal-body><header><div><span class="kicker">Append-only observation</span><h2 id="feedback-title">Add feedback</h2></div><button class="close-button" data-close aria-label="Close">×</button></header><form id="feedback-form"><div class="form-grid"><label>Product<select name="productId">${state.data.products.map((p)=>`<option value="${e(p.productId||p.key)}" ${(p.key===selected.key)?'selected':''}>${e(p.name)}</option>`).join('')}</select></label><label>Batch or test<select name="targetId">${targets}</select></label><label>Author<select name="author"><option>Andreas</option><option>Huong</option><option>Other</option></select></label><label>Name when “Other”<input name="authorName" maxlength="120" placeholder="Optional name"></label><label>Context<select name="context">${['Sauce/Cordial itself','Matcha','Coffee','Tea','Zero-proof','Cocktail','Service','Visual','Other'].map((v)=>`<option>${v}</option>`).join('')}</select></label></div><fieldset><legend>Quick observations <small>Choose any</small></legend><div class="tag-picker">${[...baseTags,...productTags].map((tag)=>`<label><input type="checkbox" name="tags" value="${e(tag)}"><span>${e(tag)}</span></label>`).join('')}</div></fieldset><fieldset><legend>Ratings <small>Optional · 1–5</small></legend><div class="rating-grid">${ratingFields.map((key)=>`<label><span>${titleCase(key)}</span><select name="rating:${e(key)}"><option value="">—</option>${[1,2,3,4,5].map((v)=>`<option value="${v}">${v}</option>`).join('')}</select></label>`).join('')}</div></fieldset><label>Note<textarea name="note" rows="4" placeholder="What happened? What should we try next?"></textarea></label><div class="form-message" aria-live="polite"></div><footer><button type="button" class="quiet-button" data-close>Cancel</button><button type="submit" class="primary-button">Save feedback</button></footer></form></section></div>`;
}

function noteModal() {
  return `<div class="modal-backdrop" data-close><section class="modal-sheet small" role="dialog" aria-modal="true" aria-labelledby="note-title" data-modal-body><header><div><span class="kicker">Available from anywhere</span><h2 id="note-title">Control Room Note</h2></div><button class="close-button" data-close>×</button></header><form id="note-form"><div class="form-grid"><label>Author<select name="author"><option>Andreas</option><option>Huong</option><option>Other</option></select></label><label>Product (optional)<select name="productId"><option value="">General note</option>${state.data.products.map((p)=>`<option value="${e(p.productId||p.key)}">${e(p.name)}</option>`).join('')}</select></label></div><label>Note<textarea name="note" rows="5" required placeholder="Try oat milk next. Good flavour, but the stripe disappears…"></textarea></label><div class="form-message"></div><footer><button type="button" class="quiet-button" data-close>Cancel</button><button class="primary-button" type="submit">Save note</button></footer></form></section></div>`;
}

function inlineMarkdown(text) {
  return e(text).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,'<a href="$2" target="_blank" rel="noreferrer">$1 ↗</a>');
}

function markdownToHtml(markdown) {
  const lines=markdown.split(/\r?\n/), out=[]; let listType=null;
  const closeList=()=>{if(listType){out.push(`</${listType}>`);listType=null;}};
  for(let i=0;i<lines.length;i+=1){const line=lines[i];
    if(line.trim().startsWith('|')&&lines[i+1]&&/^\s*\|?\s*:?-{3,}/.test(lines[i+1])){closeList();const split=(v)=>v.trim().replace(/^\||\|$/g,'').split('|');const heads=split(line);i+=2;const rows=[];while(i<lines.length&&lines[i].trim().startsWith('|')){rows.push(split(lines[i]));i++;}i--;out.push(`<div class="record-table"><table><thead><tr>${heads.map(h=>`<th>${inlineMarkdown(h.trim())}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${inlineMarkdown(c.trim())}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);continue;}
    const heading=line.match(/^(#{1,6})\s+(.+)/);if(heading){closeList();const level=Math.min(heading[1].length+1,6);out.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);continue;}
    const bullet=line.match(/^\s*[-*]\s+(.+)/), numbered=line.match(/^\s*\d+\.\s+(.+)/);if(bullet||numbered){const type=numbered?'ol':'ul';if(listType!==type){closeList();out.push(`<${type}>`);listType=type;}out.push(`<li>${inlineMarkdown((bullet||numbered)[1])}</li>`);continue;}
    closeList();if(!line.trim()){out.push('');continue;}if(line.startsWith('>'))out.push(`<blockquote>${inlineMarkdown(line.replace(/^>\s?/,''))}</blockquote>`);else out.push(`<p>${inlineMarkdown(line)}</p>`);
  }closeList();return out.join('\n');
}

function recordModal() {
  return `<div class="modal-backdrop" data-close><section class="modal-sheet record-sheet" role="dialog" aria-modal="true" data-modal-body><header><div><span class="kicker">Canonical repository record</span><h2>${e(state.modal.path)}</h2></div><button class="close-button" data-close>×</button></header>${state.modal.loading?'<div class="loading-inline">Reading record…</div>':`<div class="record-content">${markdownToHtml(state.modal.content||'')}</div>`}</section></div>`;
}

function render() {
  if (!state.data) return;
  const views = { home:renderHome, recipes:renderRecipes, product:renderProduct, lab:renderLab, batch:renderBatch, test:renderTest, feedback:renderFeedback, shopping:renderShopping, equipment:renderEquipment, research:renderResearch, reference:renderReference, queue:renderQueue };
  document.querySelector('#app').innerHTML = (views[state.route] || renderHome)();
  bind();
}

function bind() {
  document.querySelectorAll('[data-route]').forEach((el)=>el.addEventListener('click',()=>go(el.dataset.route)));
  document.querySelectorAll('[data-feedback]').forEach((el)=>el.addEventListener('click',()=>{state.modal={type:'feedback',productId:el.dataset.feedback||null,targetId:el.dataset.target||null};render();}));
  document.querySelectorAll('[data-note]').forEach((el)=>el.addEventListener('click',()=>{state.modal={type:'note'};render();}));
  document.querySelectorAll('[data-close]').forEach((el)=>el.addEventListener('click',(event)=>{if(event.target.closest('[data-modal-body]')&&!event.target.matches('[data-close]'))return;state.modal=null;render();}));
  document.querySelectorAll('[data-record]').forEach((el)=>el.addEventListener('click',async()=>{state.modal={type:'record',path:el.dataset.record,loading:true};render();try{const result=await api(`/api/record?path=${encodeURIComponent(el.dataset.record)}`);state.modal={type:'record',path:result.path,content:result.content};}catch(error){state.modal={type:'record',path:el.dataset.record,content:`# Could not open record\n\n${error.message}`};}render();}));
  document.querySelectorAll('[data-filter]').forEach((el)=>{const eventName=el.tagName==='INPUT'?'input':'change';el.addEventListener(eventName,()=>{state.filters[el.dataset.filter]=el.value;render();const replacement=document.querySelector(`[data-filter="${el.dataset.filter}"]`);if(eventName==='input'){replacement?.focus();replacement?.setSelectionRange(replacement.value.length,replacement.value.length);}});});
  document.querySelectorAll('[data-research-mode]').forEach((el)=>el.addEventListener('click',()=>{state.filters.researchMode=el.dataset.researchMode;render();}));
  document.querySelectorAll('[data-shopping]').forEach((el)=>el.addEventListener('change',async()=>{el.disabled=true;try{await api('/api/shopping',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({itemKey:el.dataset.shopping,state:el.value})});await reloadData();showToast('Shopping state saved');}catch(error){showToast(error.message);}render();}));
  document.querySelector('#feedback-form')?.addEventListener('submit',submitFeedback);
  document.querySelector('#feedback-form [name="productId"]')?.addEventListener('change',(event)=>{state.modal.productId=event.target.value;state.modal.targetId=null;render();});
  document.querySelector('#note-form')?.addEventListener('submit',submitNote);
}

async function submitFeedback(event) {
  event.preventDefault(); const form=new FormData(event.currentTarget), ratings={};
  for(const [key,value] of form.entries()) if(key.startsWith('rating:')&&value) ratings[key.slice(7)]=Number(value);
  const payload={productId:form.get('productId'),targetId:form.get('targetId'),author:form.get('author'),authorName:form.get('authorName'),context:form.get('context'),tags:form.getAll('tags'),ratings,note:form.get('note')};
  const message=event.currentTarget.querySelector('.form-message');
  try{message.textContent='Saving…';await api('/api/feedback',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});await reloadData();state.modal=null;showToast('Feedback added to the repository');render();}catch(error){message.textContent=error.message;}
}

async function submitNote(event) {
  event.preventDefault();const form=new FormData(event.currentTarget),message=event.currentTarget.querySelector('.form-message');
  try{message.textContent='Saving…';await api('/api/notes',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({author:form.get('author'),productId:form.get('productId'),note:form.get('note')})});await reloadData();state.modal=null;showToast('Control Room note saved');render();}catch(error){message.textContent=error.message;}
}

function showToast(message){state.toast=message;setTimeout(()=>{state.toast=null;document.querySelector('.toast')?.remove();},2600);}

window.addEventListener('hashchange',()=>{parseRoute();window.scrollTo(0,0);render();});
document.addEventListener('keydown',(event)=>{if(event.key==='Escape'&&state.modal){state.modal=null;render();}});

parseRoute();
reloadData().then(render).catch((error)=>{document.querySelector('#app').innerHTML=`<div class="loading"><div><strong>The repository could not be read.</strong><p>${e(error.message)}</p></div></div>`;});
