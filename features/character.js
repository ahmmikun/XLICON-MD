const { cmd, ui } = require('../lib/');
const { Character } = require('@shineiichijo/marika');
cmd(
    {
        pattern: 'character',
        category: 'weeb',
        desc: 'Searches Info about character.',
    },
    async (Void, citel, text) => {
        if (!text[1]) return citel.reply(`Please give a Name ${ui.text.greet}!`);
        const client = new Character();
        const chara = await client.searchCharacter(text).catch((err) => {
            return citel.reply(`${ui.text.greet} Couldn't find any result related to ${text}`);
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
    },
);
