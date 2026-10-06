const { sck, cmd, prefix, ui } = require('../lib');
const eco = require('discord-mongoose-economy');
cmd(
    {
        pattern: 'capacity',
        desc: 'update capacity.',
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
        if (!citel.isGroup) return citel.reply(ui.text.group);
        if (!text)
            return citel.reply(
                `💴 *Bank-capacity* 💳\n\n1 | *1000 sp* = 🪙100\n\n2 | *100000 sp* = 🪙1000\n\n3 | *10000000 sp* = 🪙10000000\n\nExample- ${prefix}capacity 1 OR ${prefix}bankupgrade 1000`,
            );
        let user = citel.mentionedJid ? citel.mentionedJid[0] : citel.msg.contextInfo.participant || false;
        let value = text.trim();
        let k = parseInt(value);
        const balance = await eco.balance(user, 'secktor');
        switch (value) {
            case '1000':
            case '1':
                if (k > balance.wallet)
                    return citel.reply(`*_You need to pay 🪙100 to increase bank capacity ~ 1000 sp_*`);
                const deduct1 = await eco.deduct(user, 'secktor', 100);
                const add1 = eco.giveCapacity(user, 'secktor', 1000);
                return await citel.reply(`*1000 🪙diamond storage has been added in ${citel.pushName} bank*`);
                break;
            case '100000':
            case '2':
                if (k < balance.wallet)
                    return citel.reply(`*You need to pay 🪙1000 to increase bank capacity ~ 100000 sp*`);
                const deduct2 = await eco.deduct(user, 'secktor', 1000);
                const add2 = eco.giveCapacity(user, 'secktor', 100000);
                return await citel.reply(`*100000 🪙diamond storage has been added in ${citel.pushName} bank*`);
                break;
            case '10000000':
            case '3':
                if (k < balance.wallet)
                    return citel.reply(`You need to pay 🪙10000 to increase bank capacity ~ 1000 sp`);
                const deduct3 = await eco.deduct(user, 'secktor', 10000);
                const add3 = eco.giveCapacity(user, 'secktor', 10000000);
                return await citel.reply(`*10000000 🪙diamond storage has been added in ${citel.pushName}\'s bank*`);
                break;
            default:
                await citel.reply('*What are you trying to do📉*.');
        }
    },
);
