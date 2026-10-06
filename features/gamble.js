const { sck, cmd, getBuffer, prefix } = require('../lib');
const eco = require('discord-mongoose-economy');
cmd(
    {
        pattern: 'gamble',
        desc: 'gamble money.',
        category: 'economy',
        filename: __filename,
        react: '💷',
    },
    async (Void, citel, text, { isCreator }) => {
        let zerogroup =
            (await sck.findOne({
                id: citel.chat,
            })) ||
            (await new sck({
                id: citel.chat,
            }).save());
        let mongoschemas = zerogroup.economy || 'false';
        if (mongoschemas == 'false') return citel.reply('*🚦Economy* is not active in current group.');
        const user = citel.sender;
        var texts = text.split(' ');
        var opp = texts[1];
        var value = texts[0].toLowerCase();
        var gg = parseInt(value);
        const secktor = 'secktor';
        const balance = await eco.balance(user, secktor);
        const g = balance.wallet > parseInt(value);
        const k = 50;
        const a = k > parseInt(value);
        const twice = gg * 2;
        var hjkl;
        if (opp === 'left') {
            hjkl = 'https://github.com/SecktorBot/Brandimages/blob/main/Nezuko/leftr.webp?raw=true';
        } else if (opp === 'right') {
            hjkl = 'https://github.com/SecktorBot/Brandimages/blob/main/Nezuko/rightr.webp?raw=true';
        } else if (opp === 'up') {
            hjkl = 'https://github.com/SecktorBot/Brandimages/blob/main/Nezuko/upr.webp?raw=true';
        } else if (opp === 'down') {
            hjkl = 'https://github.com/SecktorBot/Brandimages/blob/main/Nezuko/downr.webp?raw=true';
        } else {
            citel.reply(`Please provide direction(left,right,up,down).\nEg:- ${prefix}gamble 200 left`);
        }
        let media = await getBuffer(hjkl);
        citel.reply(
            media,
            {
                packname: 'Secktor',
                author: 'Economy',
            },
            'sticker',
        );
        const f = ['up', 'right', 'left', 'down', 'up', 'left', 'down', 'right', 'up', 'down', 'right', 'left'];
        const r = f[Math.floor(Math.random() * f.length)];
        if (!text) return citel.reply(`Example:  ${prefix}gamble 100 direction(left,right,up,down)`);
        if (!value) return citel.reply('*Please, specify the amount you are gambling with!*');
        if (!opp) return citel.reply('*Specify the direction you are betting on!*');
        if (!gg) return citel.reply('*Check your text please, You are using the command in a wrong way*');
        if (g == false) return citel.reply(`*You don't have sufficient 🪙 Diamond to gamble with*`);
        if (a == true) return citel.reply(`*Sorry ${citel.pushName}, you can only gamble with more than 🪙50.*`);
        if (r == opp) {
            let give = await eco.give(user, secktor, twice);
            return await citel.reply(`*📈 You won 🪙${twice}*`);
        } else {
            let deduct = await eco.deduct(user, secktor, texts[0]);
            return await citel.reply(`*📉 You lost 🪙${texts[0]}*`);
        }
    },
);
