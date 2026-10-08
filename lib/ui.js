const fs = require('fs');
const path = require('path');
const Config = require('../config');

const brand = {
    name: Config.botname,
    title: 'Goku',
    icon: '🐉',
    tagline: 'Fast • Simple • Powerful',
};

const text = {
    title: brand.title,
    footer: `${brand.icon} ${brand.name}`,
    greet: 'Hello there',
    wait: '⏳ Working on it...',
    success: '✅ Done.',
    owner: '🔒 Owner only. This command is for my owner.',
    group: '👥 Group only. Use this command inside a group.',
    admin: '🛡️ Admin only. Only group admins can use this.',
    botAdmin: '🤖 Make me a group admin first.',
    working: '🛠️ We are working on this. Please try again later.',
};

const images = [
    'https://wallpapercave.com/dwp1x/wp9172946.jpg',
    'https://wallpapercave.com/dwp1x/wp9173073.jpg',
    'https://wallpapercave.com/dwp1x/wp9172847.jpg',
    'https://wallpapercave.com/dwp1x/wp10557889.jpg',
    'https://wallpapercave.com/dwp1x/wp9064806.jpg',
    'https://wallpapercave.com/dwp1x/wp6523299.jpg',
];

const localImage = path.join(__dirname, 'assets', 'Xlicon.jpg');

const BOLD_SANS = { upper: 0x1d5d4, lower: 0x1d5ee, digit: 0x1d7ec };

const font = (value) =>
    [...String(value)]
        .map((char) => {
            const code = char.codePointAt(0);
            if (code >= 65 && code <= 90) return String.fromCodePoint(BOLD_SANS.upper + code - 65);
            if (code >= 97 && code <= 122) return String.fromCodePoint(BOLD_SANS.lower + code - 97);
            if (code >= 48 && code <= 57) return String.fromCodePoint(BOLD_SANS.digit + code - 48);
            return char;
        })
        .join('');

const line = (icon, label, value) => `${icon} ${font(label)}: ${value}`;

const ok = (message) => `✅ ${message}`;
const fail = (message) => `❌ ${message}`;
const info = (message) => `ℹ️ ${message}`;
const warn = (message) => `⚠️ ${message}`;

const menu = {
    header: `┌═[ *${brand.name}* ]`,
    footer: '╰════════════···▸',
    categoryHeader: '┌〈',
    categoryFooter: '〉',
    commandPrefix: '¤│▸ ',
    row: '│ ',
};

const botpic = async () => {
    if (Math.random() > 0.3) return images[Math.floor(Math.random() * images.length)];
    if (fs.existsSync(localImage)) return localImage;
    return global.THUMB_IMAGE || images[0];
};

module.exports = {
    brand,
    text,
    images,
    font,
    line,
    ok,
    fail,
    info,
    warn,
    menu,
    botpic,
    prefix: Config.HANDLERS ? Config.HANDLERS[0] : '.',
};
