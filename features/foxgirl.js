const { cmd } = require('../lib');
const { getJson } = require('../lib/api');

cmd(
    {
        pattern: 'foxgirl',
        desc: 'Send a random foxgirl image',
        category: 'anime',
        filename: __filename,
    },
    async (Void, citel) => {
        const data = await getJson('https://nekos.best/api/v2/kitsune');
        return Void.sendMessage(citel.chat, { image: { url: data.results[0].url } }, { quoted: citel });
    },
);
