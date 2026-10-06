const { cmd } = require('../lib');
const gis = require('async-g-i-s');
cmd(
    {
        pattern: 'image',
        category: 'search',
        desc: 'Searches Image on Google',
        use: '<text>',
        filename: __filename,
    },
    async (Void, citel, text) => {
        if (!text) return citel.reply('Provide me a query!');
        if (!text) return reply("Hey bie please tell me for which pic you're looking");
        let name1 = text.split('|')[0];
        let name2 = '5';
        citel.reply(`Sending ${name2} image(s) of ${name1} in chat`);
        for (let i = 0; i < parseInt(name2); i++) {
            let n = await gis(name1);
            let images = n[Math.floor(Math.random() * n.length)].url;
            await Void.sendMessage(
                citel.chat,
                {
                    image: {
                        url: images,
                    },
                    caption: `_sᴛᴀʀ-ᴍᴅ⁹⁹⁹ ɪᴍᴀɢᴇ ᴅᴏᴡɴʟᴏᴅᴇʀ_\n*${name1}*`,
                },
                {
                    quoted: citel,
                },
            );
        }
    },
);
