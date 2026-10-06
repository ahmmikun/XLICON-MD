const { sck, cmd, ui } = require('../lib');
const eco = require('discord-mongoose-economy');
cmd(
    {
        pattern: 'resetwallet',
        desc: 'reset wallet of quoted user.',
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
        if (!isCreator) return citel.reply(ui.text.owner);
        let users = citel.mentionedJid ? citel.mentionedJid[0] : citel.msg.contextInfo.participant || false;
        if (!users) return citel.reply('Please give me user.');
        const balance = await eco.balance(users, 'secktor');
        await eco.deduct(users, 'secktor', balance.wallet);
        return await citel.reply(
            `⛩️ User: @${users.split('@')[0]} \n *🧧 @${users.split('@')[0]} lost all 🪙 in wallet.*\n_Now live with that poverty.🫡_`,
            {
                mentions: [users],
            },
        );
    },
);
