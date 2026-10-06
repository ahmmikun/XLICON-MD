const { sck, cmd, prefix } = require('../lib');
const eco = require('discord-mongoose-economy');
cmd(
    {
        pattern: 'transfer',
        desc: 'transfer gold.',
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
        let value = text.trim().split(' ');
        if (value[0] === '') return citel.reply(`Use ${prefix}transfer 100 @user`);
        let user = citel.mentionedJid ? citel.mentionedJid[0] : citel.msg.contextInfo.participant || false;
        if (!user) return citel.reply('Please give me any user🤦‍♂️.');
        const secktor = 'secktor';
        const user1 = citel.sender;
        const user2 = user;
        const word = value[0];
        const code = value[1];
        let d = parseInt(word);
        if (!d) return citel.reply('check your text plz u r using the command in a wrong way👀');
        const balance = await eco.balance(user1, secktor);
        let a = balance.wallet < parseInt(word);
        if (a == true) return citel.reply('you dont have sufficient money to transfer👎');
        const deduct = await eco.deduct(user1, secktor, value[0]);
        const give = await eco.give(user2, secktor, value[0]);
        return await citel.reply(`*📠 Transaction successful of ${value[0]} 💰*`);
    },
);
