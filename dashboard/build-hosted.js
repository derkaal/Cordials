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

async function githubFile(relativePath) {
  return fetch(rawUrl(relativePath) + '?sites-sync=' + Date.now(), { headers: { accept: 'text/plain' }, cf: { cacheTtl: 0 } });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (request.method === 'GET' && url.pathname === '/api/data') {
      const upstream = await githubFile('dashboard/data-snapshot.json');
      if (!upstream.ok) return response(JSON.stringify({ error: 'The GitHub dashboard snapshot is unavailable.' }), 'application/json; charset=utf-8', 502);
      const data = await upstream.json();
      data.hostedReadOnly = true;
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
