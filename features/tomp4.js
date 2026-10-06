const { cmd, Config } = require('../lib/');
const fs = require('fs-extra');
cmd(
    {
        pattern: 'tomp4',
        alias: ['mp4', 'tovideo', 'tovid'],
        desc: 'changes type to audio.',
        category: 'converter',
        use: 'reply to any Video',
        filename: __filename,
    },
    async (Void, citel, text) => {
        const { webp2mp4File } = require('../lib');
        if (!citel.quoted) return citel.reply('*_Reply To Animated Sticker or Gif_*');
        let mime = citel.quoted.mtype;
        let mimetype = citel.quoted.mimetype;
        if (mime != 'videoMessage' && !/webp/.test(mimetype))
            return await citel.reply('*_Idiot... Reply To An Animated Sticker or Gif_*');
        let media = await Void.downloadAndSaveMediaMessage(citel.quoted);
        try {
            if (/webp/.test(mimetype)) {
                let webpToMp4 = await webp2mp4File(media);
                media = webpToMp4.result;
            }
            await Void.sendMessage(citel.chat, {
                video: {
                    url: media,
                },
                caption: `*╰┈➤ 𝙶𝙴𝙽𝙴𝚁𝙰𝚃𝙴𝙳 𝙱𝚈 ${Config.botname}*`,
            });
            try {
                return await fs.unlink(media);
            } catch (e) {
                return console.log('Error While Deleting Tomp4 File :  ', e);
            }
        } catch (e) {
            return console.log('*Your Request Not Be Proceed due to Error.*  \n*_Error :_* ', e);
        }
    },
);
