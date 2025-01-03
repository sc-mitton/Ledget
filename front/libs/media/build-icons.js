import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

const inputDir = path.resolve(import.meta.dirname, 'shared', 'svg-icons');
const nativeIconsOutDir = path.resolve(
  import.meta.dirname,
  'native',
  'src',
  'icons',
  'generated'
);
const webIconsOutDir = path.resolve(
  import.meta.dirname,
  'web',
  'src',
  'icons',
  'generated'
);
const svgrPath = path.resolve('../../node_modules', '.bin', 'svgr');

const nativeTemplate = './native-icon-template.cjs';
const webTempalte = './web-icon-template.cjs';

const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${command}`);
        console.error(stderr);
        reject(error);
      } else {
        console.log(stdout);
        resolve(stdout);
      }
    });
  });
};

const buildNativeIcons = async () => {
  if (!fs.existsSync(nativeIconsOutDir)) {
    fs.mkdirSync(nativeIconsOutDir);
  }
  if (!fs.existsSync(webIconsOutDir)) {
    fs.mkdirSync(webIconsOutDir);
  }

  const command = `${svgrPath} --config-file .svgrrc.native.cjs --template ${nativeTemplate} -d ${nativeIconsOutDir} ${inputDir}`;
  await runCommand(command);
};

const buildIcons = async () => {
  if (!fs.existsSync(webIconsOutDir)) {
    fs.mkdirSync(webIconsOutDir);
  }

  const command = `${svgrPath} --config-file .svgrrc.cjs --template ${webTempalte} -d ${webIconsOutDir} ${inputDir}`;
  await runCommand(command);
};

const main = async () => {
  const args = process.argv.slice(2);
  const isNative = args.includes('--native');

  if (isNative) {
    await buildNativeIcons();
  } else {
    await buildIcons();
  }
};

main()
  .then(() => console.log('Icons built successfully'))
  .catch((error) => console.error('Error building icons:', error));
