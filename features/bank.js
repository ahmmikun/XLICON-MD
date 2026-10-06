const { sck, cmd } = require('../lib');
const eco = require('discord-mongoose-economy');
cmd(
    {
        pattern: 'bank',
        desc: 'shows bank amount.',
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
        const balance = await eco.balance(citel.sender, 'secktor');
        return await citel.reply(`🍀User: ${citel.pushName}\n\n_🪙${balance.bank}/${balance.bankCapacity}_`);
    },
);
