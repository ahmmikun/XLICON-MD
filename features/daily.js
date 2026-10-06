const { sck, cmd, ui } = require('../lib');
const eco = require('discord-mongoose-economy');
cmd(
    {
        pattern: 'daily',
        desc: 'daily gold.',
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
        const daily = await eco.daily(citel.sender, 'secktor', 2000);
        if (daily.cd) {
            return await citel.reply(`🧧 You already claimed daily for today, come back in ${daily.cdL}🫡`);
        } else {
            citel.reply(`you claimed daily ${daily.amount} 🪙 for today🎉.`);
        }
    },
);
