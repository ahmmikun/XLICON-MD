const { cmd, getBuffer } = require('../lib');
cmd(
    {
        pattern: 'attp',
        desc: 'Makes glowing sticker of text.',
        category: 'sticker',
        filename: __filename,
    },
    async (Void, citel, text) => {
        let a = await getBuffer(`https://vihangayt.me/maker/text2gif?q=${text}`);
        return citel.reply(
            a,
            {
                packname: 'IZUKU',
                author: 'ATTP',
            },
            'sticker',
        );
    },
);
