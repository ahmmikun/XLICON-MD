const { cmd } = require('../lib');
const eco = require('discord-mongoose-economy');
cmd(
    {
        pattern: 'give',
        desc: 'Add money in wallet.',
        category: 'economy',
        filename: __filename,
        react: '💷',
    },
    async (Void, citel, text, { isCreator }) => {
        if (!isCreator) return;
        let users = citel.mentionedJid ? citel.mentionedJid[0] : citel.msg.contextInfo.participant || false;
        if (!users) return citel.reply('Please give me user to add money.');
        await eco.give(users, 'secktor', parseInt(text.split(' ')[0]));
        return await Void.sendMessage(
            citel.chat,
            {
                text: `Added 📈 ${parseInt(text.split(' ')[0])} to @${users.split('@')[0]} wallet🛸.`,
                mentions: [users],
            },
            {
                quoted: citel,
            },
        );
    },
);
