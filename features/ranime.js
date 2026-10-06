const { cmd } = require('../lib/');
cmd(
    {
        pattern: 'ranime',
        category: 'weeb',
        desc: 'Info about random anime.',
    },
    async (Void, citel, text) => {
        const { Anime, Manga, Character } = require('@shineiichijo/marika');
        const animeClient = new Anime();
        const charaClient = new Character();
        let a = await charaClient.getRandomCharacter();
        const chara = await charaClient.searchCharacter(a.name).catch((err) => {
            return;
        });
        let texty = '';
        texty += `🏮*Name: ${chara.data[0].name}*\n`;
        texty += `🌐 *Source:* _Secktor-Md bot_\n`;
        texty += `📶 *URL:* ${chara.data[0].url}*\n\n`;
        texty += `*📑 Description*: ${chara.data[0].about}\n`;
        let gis = require('async-g-i-s');
        let n = await gis(text + 'MAL CHARACTER HD IMAGE');
        images = n[Math.floor(Math.random() * n.length)].url;
        Void.sendMessage(
            citel.chat,
            {
                image: {
                    url: images,
                },
                caption: texty,
            },
            {
                quoted: citel,
            },
        );
        await Void.sendMessage(
            citel.chat,
            {
                image: {
                    url: cha[0].images.jpg.image_url,
                },
                caption: data2,
            },
            {
                quoted: citel,
            },
        );
    },
);
