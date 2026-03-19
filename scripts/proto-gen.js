const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

const protoDir = path.join(__dirname, '../libs/packages/proto');
const outDir = path.join(__dirname, '../libs/packages/generated');

// Remove and recreate the output directory
fs.removeSync(outDir);
fs.ensureDirSync(outDir);

// Find all .proto files recursively in protoDir
function getProtoFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getProtoFiles(filePath));
    } else if (file.endsWith('.proto')) {
      results.push(filePath);
    }
  });
  return results;
}

const protoFiles = getProtoFiles(protoDir);
if (protoFiles.length === 0) {
  console.error('No .proto files found in', protoDir);
  process.exit(1);
}

const protoArgs = [
  `--js_out=import_style=commonjs,binary:${outDir}`,
  `--grpc_out=${outDir}`,
  `--ts_out=${outDir}`,
  `-I`,
  protoDir,
  ...protoFiles,
];

const cmd = `npx grpc_tools_node_protoc ${protoArgs.map((a) => `\"${a}\"`).join(' ')}`;

try {
  execSync(cmd, { stdio: 'inherit' });
  console.log('Proto files generated successfully.');
} catch (err) {
  console.error('Error generating proto files:', err.message);
  process.exit(1);
}
// fs.ensureDirSync(outDir);

// async function generate() {
//   // Find all proto files (async glob)
//   const protoFiles = await glob('libs/packages/proto/**/*.proto');
//   if (!protoFiles.length) {
//     console.error('No proto files found!');
//     process.exit(1);
//   }

//   console.log('Generating TS files from protos:', protoFiles);

//   for (const protoFile of protoFiles) {
//     const fileName = path.basename(protoFile, '.proto') + '.ts';
//     const outPath = path.join(outDir, fileName);

//     // Parse the proto file and write TS output
//     await parse(protoFile).then((result) => result.toFile(outPath));
//     console.log('Generated', outPath);
//   }
//   console.log('✅ Proto generation completed!');
// }

// generate().catch((err) => {
//   console.error('Error generating protos:', err);
//   process.exit(1);
// });
