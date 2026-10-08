const sharp = require('sharp');
const { cmd, Config, ui } = require('../lib');

const escapeXml = (value) => value.replace(/[<>&"']/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char]);

const wrap = (text, width) => {
    const lines = [];
    let current = '';
    for (const word of text.split(/\s+/)) {
        if (current && `${current} ${word}`.length > width) {
            lines.push(current);
            current = word;
        } else {
            current = current ? `${current} ${word}` : word;
        }
    }
    if (current) lines.push(current);
    return lines.slice(0, 8);
};

const render = (text) => {
    const lines = wrap(text, 12);
    const size = Math.max(40, Math.min(110, Math.floor(480 / Math.max(lines.length, 1))));
    const top = 256 - ((lines.length - 1) * size * 1.1) / 2;
    const spans = lines.map((line, index) => `<tspan x="256" y="${top + index * size * 1.1}">${escapeXml(line)}</tspan>`).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><text text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-weight="bold" font-size="${size}" fill="#ffffff" stroke="#000000" stroke-width="${Math.round(size / 14)}" paint-order="stroke">${spans}</text></svg>`;
    return sharp(Buffer.from(svg)).png().toBuffer();
};

cmd(
    {
        pattern: 'ttp',
        desc: 'Turn text into a sticker',
        use: '<text>',
        category: 'sticker',
        filename: __filename,
    },
    async (Void, citel, text) => {
        if (!text.trim()) return citel.reply(ui.info(`Give me some text, e.g. ${ui.prefix}ttp hello`));
        const image = await render(text.trim());
        return citel.reply(image, { packname: Config.packname, author: Config.author }, 'sticker');
    },
);
