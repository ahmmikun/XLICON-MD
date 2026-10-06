const { cmd, ui } = require('../lib/');
cmd(
    {
        pattern: 'pokepic',
        category: 'weeb',
        desc: 'Sends image of pokemon in current chat.',
    },
    async (Void, citel, text) => {
        let gis = require('async-g-i-s');
        var pictured = 'Pokemon Pics only HD ';
        let n = await gis(text + pictured);
        images = n[Math.floor(Math.random() * n.length)].url;
        let buttonMessage = {
            image: {
                url: images,
            },
            caption: `*---「 Poke Pic 」---*`,
            footer: Void.user.name,
            headerType: 4,
            contextInfo: {
                externalAdReply: {
                    title: ui.text.title,
                    body: text,
                    thumbnail: log0,
                    mediaType: 2,
                    mediaUrl: ``,
                    sourceUrl: ``,
                },
            },
        };
        Void.sendMessage(citel.chat, buttonMessage, {
            quoted: citel,
        });
    },
);
