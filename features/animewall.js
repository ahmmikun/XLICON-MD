const { cmd, ui } = require('../lib/');
cmd(
    {
        pattern: 'animewall',
        category: 'weeb',
        desc: 'Anime Wallpaper Random',
    },
    async (Void, citel, text) => {
        try {
            var ecchid = 'anime wallpaper for desktop full hd';
            let gis = require('async-g-i-s');
            let n = await gis(text + ecchid);
            images = n[Math.floor(Math.random() * n.length)].url;
            let buttonMessage = {
                image: {
                    url: images,
                },
                caption: `*--- Anime Wallpaper---*`,
                footer: Void.user.name,
                headerType: 4,
                contextInfo: {
                    externalAdReply: {
                        title: ui.text.title,
                        body: `Anime-Wallpaper`,
                        jpegThumbnail: log0,
                        thumbnail: log0,
                        mediaType: 2,
                        mediaUrl: ``,
                        sourceUrl: ``,
                    },
                },
            };
            Void.sendMessage(
                citel.chat,
                buttonMessage,
                {
                    viewOnce: true,
                },
                {
                    quoted: citel,
                },
            );
        } catch (e) {
            console.log(e);
        }
    },
);
