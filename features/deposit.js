const { sck, cmd } = require('../lib');
const eco = require('discord-mongoose-economy');
cmd(
    {
        pattern: 'deposit',
        desc: 'deposit gold.',
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
        if (!text) return citel.reply('Baka!! Provide the 💰amount you want to deposit!');
        let d = parseInt(text);
        const deposit = await eco.deposit(citel.sender, 'secktor', d);
        const balance = await eco.balance(citel.sender, 'secktor');
        if (deposit.noten) return citel.reply("You can't deposit what you don't have💰.");
        return await citel.reply(
            `⛩️ Sender: ${citel.pushName}\n🍀Successfully 💰Deposited 🪙${deposit.amount} to your bank.Upgrade your bank capacity to add more money📈.`,
        );
    },
);
