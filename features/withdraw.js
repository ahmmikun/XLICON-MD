const { sck, cmd } = require('../lib');
const eco = require('discord-mongoose-economy');
cmd(
    {
        pattern: 'withdraw',
        desc: 'withdraw money from bank account.',
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
        if (!text) return citel.reply('*Provide the amount💰 you want to withdraw💳!*');
        const query = text.trim();
        const withdraw = await eco.withdraw(user, 'secktor', query);
        if (withdraw.noten) return citel.reply('*🏧 Insufficient fund in bank🫤*');
        const add = eco.give(user, 'secktor', query);
        citel.reply(`*🏧 ALERT* \n _🪙${withdraw.amount} has been withdrawn from your wallet💰._`);
    },
);
