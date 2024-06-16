const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const svgrPath = path.resolve('../../node_modules', '.bin', 'svgr');
const iconsOutDir = path.resolve(__dirname, './src/icons/generated');
const nativeIconsOutDir = path.resolve(__dirname, './src/native-icons/generated');

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
    if (!fs.existsSync(iconsOutDir)) {
        fs.mkdirSync(iconsOutDir);
    }
    if (!fs.existsSync(nativeIconsOutDir)) {
        fs.mkdirSync(nativeIconsOutDir);
    }

    const command = `${svgrPath} --config-file .svgrrc.native.cjs --template ./src/templates/native.js -d ${nativeIconsOutDir} ./src/svg`;
    await runCommand(command);
};

const buildIcons = async () => {
    if (!fs.existsSync(iconsOutDir)) {
        fs.mkdirSync(iconsOutDir);
    }

    const command = `${svgrPath} --config-file .svgrrc.cjs --template ./src/templates/web.js -d ${iconsOutDir} ./src/svg`;
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
