const fs = require('node:fs');
const path = require('node:path');
const { buildData } = require('./server');

const output = path.join(__dirname, 'data-snapshot.json');
const data = buildData();
fs.writeFileSync(output, `${JSON.stringify(data)}\n`, 'utf8');
console.log(`Wrote ${path.relative(process.cwd(), output)}`);
