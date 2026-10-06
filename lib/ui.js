const fs = require('fs');
const path = require('path');
const Config = require('../config');

const brand = {
    name: 'XLICON',
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

const bar = '─'.repeat(12);

const ok = (message) => `✅ ${message}`;
const fail = (message) => `❌ ${message}`;
const info = (message) => `ℹ️ ${message}`;
const warn = (message) => `⚠️ ${message}`;

const head = (title, icon = brand.icon) => `╭─〔 ${icon} ${title} 〕`;
const section = (title, icon) => `├─〔 ${icon} ${title} 〕`;
const row = (line = '') => `│ ${line}`.trimEnd();
const end = () => `╰${bar}`;

const panel = (title, icon, lines) => [head(title, icon), row(), ...lines.map(row), row(), end()].join('\n');

const field = (icon, label, value) => `${icon} *${label}:* ${value}`;

const botpic = async () => {
    if (Math.random() > 0.3) return images[Math.floor(Math.random() * images.length)];
    if (fs.existsSync(localImage)) return localImage;
    return global.THUMB_IMAGE || images[0];
};

module.exports = {
    brand,
    text,
    images,
    ok,
    fail,
    info,
    warn,
    head,
    section,
    row,
    end,
    panel,
    field,
    botpic,
    prefix: Config.HANDLERS ? Config.HANDLERS[0] : '.',
};
