const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

const protoDir = path.join(__dirname, '../libs/packages/src/proto');
const outDir = path.join(__dirname, '../libs/packages/src/generated');

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

// Ensure the output directory exists
fs.ensureDirSync(outDir);

const protoFiles = getProtoFiles(protoDir);
if (protoFiles.length === 0) {
  console.error('No .proto files found in', protoDir);
  process.exit(1);
}

const isWin = process.platform === 'win32';
const tsProtoBin = path.resolve(
  __dirname,
  '../node_modules/.bin/protoc-gen-ts_proto' + (isWin ? '.cmd' : ''),
);
const protoArgs = [
  `--plugin=protoc-gen-ts_proto=${tsProtoBin}`,
  `--ts_proto_opt=nestJs=true,addGrpcMetadata=true,useOptionals=messages,outputServices=grpc-js`,
  `--ts_proto_out=${outDir}`,
  `--proto_path=${protoDir}`,
  ...protoFiles,
];

const cmd = `npx protoc ${protoArgs.map((a) => `\"${a}\"`).join(' ')}`;

try {
  execSync(cmd, { stdio: 'inherit' });
  console.log('Proto files generated with ts-proto successfully.');
} catch (err) {
  console.error('Error generating proto files with ts-proto:', err.message);
  process.exit(1);
}
