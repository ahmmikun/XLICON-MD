const { commands } = require('./registry');

const ORDER = ['general', 'group', 'owner', 'tools', 'downloader', 'fun', 'game', 'economy', 'search'];

const ICONS = [
    [/general/, '🤖'],
    [/group/, '👥'],
    [/owner|admin/, '👑'],
    [/tool|util/, '🛠️'],
    [/download|dl/, '⬇️'],
    [/sticker/, '🖼️'],
    [/textpro|text/, '🔤'],
    [/reaction/, '🫶'],
    [/religion|bible/, '📖'],
    [/editor|photo|image/, '🎨'],
    [/convert|audio|media/, '🎬'],
    [/game/, '🎮'],
    [/fun|troll|meme|ship/, '🎉'],
    [/anime|weeb|waifu/, '🎌'],
    [/econom|wallet|bank/, '💰'],
    [/search|google/, '🔎'],
    [/user|profile/, '👤'],
    [/ai|chat|bot/, '🧠'],
];

const normalize = (value) => String(value || 'misc').normalize('NFKC').trim().toLowerCase() || 'misc';

const ACRONYMS = { ai: 'AI', nsfw: 'NSFW' };

const title = (key) => ACRONYMS[key] || key.replace(/\b\w/g, (letter) => letter.toUpperCase());

const iconFor = (key) => (ICONS.find(([pattern]) => pattern.test(key)) || [null, '✨'])[1];

const rank = (key) => {
    const index = ORDER.findIndex((name) => key.includes(name));
    return index === -1 ? ORDER.length : index;
};

const groups = () => {
    const byKey = new Map();
    for (const command of commands) {
        if (!command.pattern || command.dontAddCommandList) continue;
        const key = normalize(command.category);
        if (!byKey.has(key)) byKey.set(key, []);
        const items = byKey.get(key);
        if (!items.some((item) => item.pattern === command.pattern)) items.push(command);
    }
    return [...byKey.entries()]
        .map(([key, items]) => ({
            key,
            label: title(key),
            icon: iconFor(key),
            items: items.sort((a, b) => a.pattern.localeCompare(b.pattern)),
        }))
        .sort((a, b) => rank(a.key) - rank(b.key) || a.key.localeCompare(b.key));
};

const shortDesc = (desc) => {
    const line = String(desc || '').split('\n')[0].trim().replace(/\.$/, '');
    return line.length > 60 ? `${line.slice(0, 57)}...` : line || 'No description';
};

const find = (name) => {
    const key = String(name || '').toLowerCase();
    return commands.find((command) => command.pattern === key) || commands.find((command) => command.alias && command.alias.includes(key));
};

module.exports = { groups, shortDesc, find };
