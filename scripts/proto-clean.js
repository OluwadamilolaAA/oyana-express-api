const fs = require('fs-extra');
const path = require('path');

const outDir = path.join(__dirname, '../libs/packages/generated');
fs.removeSync(outDir);
fs.ensureDirSync(outDir);
console.log('Cleaned and recreated', outDir);
