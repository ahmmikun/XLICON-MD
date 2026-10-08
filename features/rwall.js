const { cmd } = require('../lib');
const { getJson } = require('../lib/api');

cmd(
    {
        pattern: 'rwall',
        desc: 'Send a random wallpaper',
        category: 'misc',
        filename: __filename,
    },
    async (Void, citel) => {
        const data = await getJson('https://wallhaven.cc/api/v1/search', { params: { categories: '111', purity: '100', sorting: 'random' } });
        return Void.sendMessage(citel.chat, { image: { url: data.data[0].path } }, { quoted: citel });
    },
);
