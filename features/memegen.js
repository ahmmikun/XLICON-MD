const { cmd, TelegraPh, getBuffer, ui } = require('../lib');
const fs = require('fs-extra');
cmd(
    {
        pattern: 'memegen',
        desc: 'Write text on quoted image.',
        category: 'group',
        filename: __filename,
        use: '<text>',
    },
    async (Void, citel, text) => {
        let mime = citel.quoted.mtype;
        if (!/image/.test(mime)) return citel.reply(`Reply to Photo With Caption *text*`);
        mee = await Void.downloadAndSaveMediaMessage(citel.quoted);
        mem = await TelegraPh(mee);
        meme = await getBuffer(`https://api.memegen.link/images/custom/-/${text}.png?background=${mem}`);
        let buttonMessage = {
            image: meme,
            caption: 'Here we go',
            footer: ui.text.footer,
            headerType: 4,
        };
        Void.sendMessage(citel.chat, buttonMessage, {
            quoted: citel,
        });
        await fs.unlinkSync(mee);
    },
);
