const Config = require('../config');
const { cmd, ui } = require('../lib/');
cmd(
    {
        pattern: 'animepic',
        category: 'weeb',
        desc: 'Anime image',
    },
    async (Void, citel, text) => {
        var pictured = 'Anime Pics HD ';
        let gis = require('async-g-i-s');
        let n = await gis(text + pictured);
        images = n[Math.floor(Math.random() * n.length)].url;
        let buttonMessage = {
            image: {
                url: images,
            },
            caption: `*-----「 Anime Image 」-----*`,
            footer: Void.user.name,
            headerType: 4,
            contextInfo: {
                externalAdReply: {
                    title: ui.text.title,
                    body: `Anime Pics`,
                    thumbnail: log0,
                    mediaType: 2,
                    renderLargerThumbnail: true,
                    mediaUrl: Config.github,
                    sourceUrl: ``,
                },
            },
        };
        Void.sendMessage(citel.chat, buttonMessage, {
            quoted: citel,
        });
    },
);
