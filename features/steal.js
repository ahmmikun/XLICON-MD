const { Config, cmd } = require('../lib');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
cmd(
    {
        pattern: 'steal',
        desc: 'Makes sticker of replied image/video.',
        category: 'sticker',
        filename: __filename,
    },
    async (Void, citel, text) => {
        if (!citel.quoted) return citel.reply(`*Mention the Image or video Sir.*`);
        let mime = citel.quoted.mtype;
        var pack;
        var author;
        if (text) {
            anu = text.split('|');
            pack = anu[0] !== '' ? anu[0] : citel.pushName + '✨';
            author = anu[1] !== '' ? anu[1] : Config.author;
        } else {
            pack = citel.pushName;
            author = '✨';
        }
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
    },
);
