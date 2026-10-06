const { cmd, Config } = require('../lib/');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
cmd(
    {
        pattern: 'round',
        alias: ['roundstic', 'roundsticker'],
        desc: 'Makes sticker of replied image/video.',
        category: 'sticker',
        filename: __filename,
        use: '<reply to any image/video.>',
    },
    async (Void, citel, text) => {
        if (!citel.quoted) return citel.reply(`*Reply To any Image or video Sir.*`);
        let mime = citel.quoted.mtype;
        pack = Config.packname;
        author = Config.author;
        if (mime == 'imageMessage' || mime == 'stickerMessage') {
            let media = await citel.quoted.download();
            let sticker = new Sticker(media, {
                pack: pack,
                author: author,
                type: StickerTypes.ROUNDED,
                categories: ['🤩', '🎉'],
                id: '12345',
                quality: 75,
            });
            const buffer = await sticker.toBuffer();
            return Void.sendMessage(
                citel.chat,
                {
                    sticker: buffer,
                },
                {
                    quoted: citel,
                },
            );
        } else return citel.reply('*Please reply to any image*');
    },
);
