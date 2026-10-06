const { sck, cmd } = require('../lib');
const eco = require('discord-mongoose-economy');
cmd(
    {
        pattern: 'rob',
        desc: 'rob bank amount.',
        category: 'economy',
        filename: __filename,
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
        let users = citel.mentionedJid ? citel.mentionedJid[0] : citel.msg.contextInfo.participant || false;
        if (!users) return citel.reply('Please give me user to rob.');
        const user1 = citel.sender;
        const user2 = users;
        const k = 1000;
        const balance1 = await eco.balance(user1, 'secktor');
        const balance2 = await eco.balance(user2, 'secktor');
        const typ = ['ran', 'rob', 'caught'];
        const random = typ[Math.floor(Math.random() * typ.length)];
        if (k > balance1.wallet) return citel.reply(`*☹️ You don't have enough money to pay incase you get caught*`);
        if (k > balance2.wallet) return citel.reply(`*Sorry, your victim is too poor 🤷🏽‍♂️ let go🫤.*`);
        let tpy = random;
        switch (random) {
            case 'ran':
                await citel.reply(`*Your victim escaped, be more scary next time🫰.*`);
                break;
            case 'rob':
                const deduff = Math.floor(Math.random() * 1000);
                await eco.deduct(user2, 'secktor', deduff);
                await eco.give(citel.sender, 'secktor', deduff);
                await citel.reply(
                    `*🤑 Robbery operation done successfully.🗡️*\nYou ran with ${deduff} amount in your wallet.`,
                );
                break;
            case 'caught':
                const rmoney = Math.floor(Math.random() * 1000);
                await eco.deduct(user1, 'secktor', rmoney);
                await citel.reply(`*Sorry FBI👮 caught up with you, you paid ${rmoney} 🪙 from wallet🥹.*`);
                break;
            default:
                await citel.reply('*What are you trying to do👀*.');
        }
    },
);
