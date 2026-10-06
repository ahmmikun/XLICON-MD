const { cmd, getBuffer } = require('../lib');
cmd(
    {
        pattern: 'ttp',
        desc: 'Makes static sticker of text.',
        category: 'sticker',
        filename: __filename,
    },
    async (Void, citel, text) => {
        let a = await getBuffer(`https://vihangayt.me/maker/text2img?q=${text}`);
        return citel.reply(
            a,
            {
                packname: '𝐒𝐓𝐀𝐑',
                author: 'TTP',
            },
            'sticker',
        );
    },
);
