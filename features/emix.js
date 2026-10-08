const { prefix, fetchJson, cmd, Config, ui } = require('../lib');
const fs = require('fs');
cmd(
    {
        pattern: 'emix',
        desc: 'Mixes two emojies.',
        category: 'misc',
        use: '<query>',
        filename: __filename,
    },
    async (Void, citel, text, { isCreator }) => {
        if (!text) return citel.reply(`Example : ${prefix}emix 😅,🤔`);
        if (!Config.keys.tenor) return citel.reply(ui.text.working);
        let [emoji1, emoji2] = text.split`,`;
        let anu = await fetchJson(
            `https://tenor.googleapis.com/v2/featured?key=${Config.keys.tenor}&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`,
        );
        for (let res of anu.results) {
            let encmedia = await Void.sendImageAsSticker(citel.chat, res.url, citel, {
                packname: Config.packname,
                author: Config.author,
                categories: res.tags,
            });
            await fs.unlinkSync(encmedia);
        }
    },
);
