const { cmd, ui } = require('../lib');
const { getJson } = require('../lib/api');

cmd(
    {
        pattern: 'wallpaper',
        desc: 'Search for a wallpaper',
        use: '<keyword>',
        category: 'misc',
        filename: __filename,
    },
    async (Void, citel, text) => {
        const query = text.trim();
        if (!query) return citel.reply(ui.info(`Give me a keyword, e.g. ${ui.prefix}wallpaper goku`));
        const data = await getJson('https://wallhaven.cc/api/v1/search', { params: { q: query, categories: '111', purity: '100', sorting: 'random' } });
        if (!data.data.length) return citel.reply(ui.fail(`No wallpaper found for "${query}".`));
        return Void.sendMessage(citel.chat, { image: { url: data.data[0].path } }, { quoted: citel });
    },
);
