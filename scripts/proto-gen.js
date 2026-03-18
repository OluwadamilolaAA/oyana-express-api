import fs from 'fs-extra';
import path from 'path';
import glob from 'glob';
import { parse } from 'protots';

// Output folder
const outDir = path.resolve('libs/packages/generated');

// Clean and create output folder
fs.removeSync(outDir);
fs.ensureDirSync(outDir);

// Find all proto files
const protoFiles = glob.sync('libs/packages/proto/**/*.proto');
if (!protoFiles.length) {
  console.error('No proto files found!');
  process.exit(1);
}

console.log('Generating TS files from protos:', protoFiles);

async function generate() {
  for (const protoFile of protoFiles) {
    const fileName = path.basename(protoFile, '.proto') + '.ts';
    const outPath = path.join(outDir, fileName);

    // Parse the proto file and write TS output
    await parse(protoFile).then(result => result.toFile(outPath));
    console.log('Generated', outPath);
  }
  console.log('✅ Proto generation completed!');
}

generate().catch(err => {
  console.error('Error generating protos:', err);
  process.exit(1);
});