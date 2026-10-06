const { cmd, Config } = require('../lib');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
cmd(
    {
        pattern: 'sticker',
        alias: ['s'],
        desc: 'Makes sticker of replied image/video.',
        category: 'group',
        use: '<reply to any image/video.>',
    },
    async (Void, citel, text) => {
        if (!citel.quoted) return citel.reply(`*Mention any Image or video Sir.*`);
        let mime = citel.quoted.mtype;
        pack = Config.packname;
        author = Config.author;
        if (citel.quoted) {
            let media = await citel.quoted.download();
            citel.reply('*Processing Your request*');
            let sticker = new Sticker(media, {
                pack: pack,
                author: author,
                type: text.includes('--crop' || '-c') ? StickerTypes.CROPPED : StickerTypes.FULL,
                categories: ['🤩', '🎉'],
                id: '12345',
                quality: 75,
                background: 'transparent',
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
        } else if (/video/.test(mime)) {
            if ((quoted.msg || citel.quoted).seconds > 20)
                return citel.reply('Cannot fetch videos longer than *20 Seconds*');
            let media = await quoted.download();
            let sticker = new Sticker(media, {
                pack: pack,
                author: author,
                type: StickerTypes.FULL,
                categories: ['🤩', '🎉'],
                id: '12345',
                quality: 70,
                background: 'transparent',
            });
            const stikk = await sticker.toBuffer();
            return Void.sendMessage(
                citel.chat,
                {
                    sticker: stikk,
                },
                {
                    quoted: citel,
                },
            );
        } else {
            citel.reply('*Uhh,Please reply to any image or video*');
        }
    },
);
