const { sck, cmd } = require('../lib');
const eco = require('discord-mongoose-economy');
cmd(
    {
        pattern: 'slot',
        desc: 'slot game.',
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
        const kg = 100;
        const balance1 = await eco.balance(citel.sender, 'secktor');
        if (kg > balance1.wallet)
            return citel.reply(`You are going to be spinning on your wallet, you need at least 🪙100`);
        var r_ban = new Array();
        r_ban[0] = '1 : 2 : 3';
        r_ban[1] = '1 : 2 : 3';
        r_ban[2] = '1 : 2 : 3';
        r_ban[3] = '4 : 3 : 3';
        r_ban[4] = '1 : 1 : 1';
        r_ban[5] = '5 : 2 : 5';
        r_ban[6] = '3 : 5 : 3';
        r_ban[7] = '1 : 3 : 6';
        r_ban[8] = '6 : 2 : 7';
        r_ban[9] = '1 : 6 : 3';
        r_ban[10] = '6 : 3 : 2';
        r_ban[11] = '5 : 5 : 6';
        r_ban[12] = '1 : 5 : 3';
        r_ban[13] = '4 : 1 : 7';
        r_ban[14] = '4 : 3 : 2';
        r_ban[15] = '4 : 3 : 2';
        r_ban[16] = '7 : 4 : 6';
        r_ban[17] = '6 : 5 : 1';
        r_ban[18] = '5 : 7 : 2';
        var p = Math.floor(19 * Math.random());
        var q = Math.floor(19 * Math.random());
        var r = Math.floor(19 * Math.random());
        var i = r_ban[p];
        var j = r_ban[q];
        var k = r_ban[r];
        console.log(i + '\n' + j + '\n' + k);
        let t = i.split(':');
        let tt = j.split(':');
        let ttt = k.split(':');
        var lol;
        if (t[2] === tt[1] && tt[1] === ttt[0]) lol = true;
        if (t[0] === tt[1] && tt[1] === ttt[2]) lol = true;
        if (t[0] === tt[0] && tt[0] === ttt[0]) lol = true;
        if (t[1] === tt[1] && tt[1] === ttt[1]) lol = true;
        if (t[2] === tt[2] && tt[2] === ttt[2]) lol = true;
        if (t[0] === tt[1] && tt[1] === ttt[2]) lol = true;
        if (t[2] === tt[1] && tt[1] === ttt[0]) lol = true;
        if (t[0] === t[1] && t[0] === t[2]) lol = true;
        if (tt[0] === tt[1] && tt[0] === tt[2]) lol = true;
        if (ttt[0] === ttt[1] && ttt[0] === ttt[2]) lol = true;
        if (t[0] === ttt[1] && t[0] === ttt[2]) lol = true;
        if (lol) {
            const deduff = Math.floor(Math.random() * 5000);
            const give2 = await eco.give(citel.sender, 'secktor', deduff * 2);
            let st = `🎰 Slot Machine Result\n     ${i}\n\n     ${j}\n\n     ${k}\n\nWow Jackpot🎊.`;
            let str = st
                .replace(/1/g, `🔴`)
                .replace(/2/g, `🔵`)
                .replace(/3/g, `🟣`)
                .replace(/4/g, `🟢`)
                .replace(/5/g, `🟡`)
                .replace(/6/g, `⚪️`)
                .replace(/7/g, `⚫️`)
                .replace(/:/g, `  `);
            return await citel.reply(str + `You got ${deduff * 10} in your wallet.`);
        } else {
            const deduff = Math.floor(Math.random() * 300);
            const deduct1 = await eco.deduct(citel.sender, 'secktor', deduff);
            let st = `\n🎰 Slot Machine Result\n     ${i}\n\n      ${j}\n\n      ${k}\n\nNot Jacpot📉 but lost `;
            let str = st
                .replace(/1/g, `🔴`)
                .replace(/2/g, `🔵`)
                .replace(/3/g, `🟣`)
                .replace(/4/g, `🟢`)
                .replace(/5/g, `🟡`)
                .replace(/6/g, `⚪️`)
                .replace(/7/g, `⚫️`)
                .replace(/:/g, `    `);
            return await citel.reply(str + ` ${deduff}.`);
        }
    },
);
