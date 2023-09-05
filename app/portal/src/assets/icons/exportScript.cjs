const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'src');
const files = fs.readdirSync(iconsDir);

const icons = files
    .filter(file => file.endsWith('.jsx'))
    .map(file => {
        const iconName = path.basename(file, '.jsx');
        return `export { default as ${iconName} } from './src/${file}';`;
    })
    .join('\n');

fs.writeFileSync('index.js', icons);
