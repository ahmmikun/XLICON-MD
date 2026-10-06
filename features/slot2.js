const { sck, cmd, prefix } = require('../lib');
const eco = require('discord-mongoose-economy');
cmd(
    {
        pattern: 'slot2',
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
        var today = new Date();
        if (today.getDay() == 6 || today.getDay() == 5 || today.getDay() == 0) {
            if (text == 'help')
                return citel.reply(
                    `*1:* Use ${prefix}slot to play\n\n*2:* You must have 🪙100 in your wallet\n\n*3:* If you don't have money in wallet then 👛withdraw from your bank🏦\n\n*4:* If you don't have 🤑 money in your 🏦bank too then use economy features to 📈gain money`,
                );
            if (text == 'money')
                return citel.reply(
                    `*1:* Small Win --> +🪙20\n\n*2:* Small Lose --> -🪙20\n\n*3:* Big Win --> +🪙100\n\n*4:* Big Lose --> -🪙50\n\n*5:* 🎉 JackPot --> +🪙1000`,
                );
            const fruit1 = ['🥥', '🍎', '🍇'];
            const fruit2 = ['🍎', '🍇', '🥥'];
            const fruit3 = ['🍇', '🥥', '🍎'];
            const fruit4 = '🍇';
            const lose = [
                '*You suck at playing this game*\n\n_--> 🍍-🥥-🍎_',
                '*Totally out of line*\n\n_--> 🥥-🍎-🍍_',
                '*Are you a newbie?*\n\n_--> 🍎-🍍-🥥_',
            ];
            const smallLose = [
                '*You cannot harvest coconut 🥥 in a pineapple 🍍 farm*\n\n_--> 🍍>🥥<🍍_',
                '*Apples and Coconut are not best Combo*\n\n_--> 🍎>🥥<🍎_',
                '*Coconuts and Apple are not great deal*\n\n_--> 🥥>🍎<🥥_',
            ];
            const won = [
                '*You harvested a basket of*\n\n_--> 🍎+🍎+🍎_',
                '*Impressive, You must be a specialist in plucking coconuts*\n\n_--> 🥥+🥥+🥥_',
                '*Amazing, you are going to be making pineapple juice for the family*\n\n_--> 🍍+🍍+🍍_',
            ];
            const near = [
                '*Wow, you were so close to winning pineapples*\n\n_--> 🍎-🍍+🍍_',
                '*Hmmm, you were so close to winning Apples*\n\n_--> 🍎+🍎-🍍_',
            ];
            const jack = [
                '*🥳 JackPot 🤑*\n\n_--> 🍇×🍇×🍇×🍇_',
                '*🎉 JaaackPooot!*\n\n_--> 🥥×🥥×🥥×🥥_',
                '*🎊 You Just hit a jackpot worth 🪙1000*',
            ];
            const user = citel.sender;
            const secktor = 'secktor';
            const k = 100;
            const balance1 = await eco.balance(user, secktor);
            if (k > balance1.wallet)
                return citel.reply(`You are going to be spinning on your wallet, you need at least 🪙100`);
            const f1 = fruit1[Math.floor(Math.random() * fruit1.length)];
            const f2 = fruit2[Math.floor(Math.random() * fruit2.length)];
            const f3 = fruit3[Math.floor(Math.random() * fruit3.length)];
            const mess1 = lose[Math.floor(Math.random() * lose.length)];
            const mess2 = won[Math.floor(Math.random() * won.length)];
            const mess3 = near[Math.floor(Math.random() * near.length)];
            const mess4 = jack[Math.floor(Math.random() * jack.length)];
            const mess5 = smallLose[Math.floor(Math.random() * smallLose.length)];
            if (text.split(' ')[0]) {
                let value = text.split(' ')[0];
                const balance = await eco.balance(citel.sender, secktor);
                console.log(balance.wallet);
                if (value <= balance.wallet) {
                    const deduff = Math.floor(Math.random() * value);
                    if (f1 !== f2 && f2 !== f3) {
                        const deduct1 = await eco.deduct(user, secktor, deduff);
                        return citel.reply(`${mess1}\n\n*Big Lose -->* _🪙${deduff}_`);
                    } else if (f1 == f2 && f2 == f3) {
                        const give1 = await eco.give(user, secktor, deduff / 2);
                        return citel.reply(`${mess2}\n*_Little Jackpot -->* _🪙${deduff / 2}_`);
                    } else if (f1 == f2 && f2 !== f3) {
                        const give2 = await eco.give(user, secktor, deduff);
                        return citel.reply(`${mess3}\n*Small Win -->* _🪙${deduff}_`);
                    } else if (f1 !== f2 && f1 == f3) {
                        const deduct2 = await eco.deduct(user, secktor, deduff);
                        return citel.reply(`${mess5}\n\n*Small Lose -->* _🪙${deduff}_`);
                    } else if (f1 !== f2 && f2 == f3) {
                        const give4 = eco.give(user, secktor, deduff);
                        return citel.reply(`${mess3}\n\n*Small Win -->* _🪙${deduff}_`);
                    } else if (f1 == f2 && f2 == f3 && f3 == f4) {
                        const give5 = eco.give(user, secktor, deduff * 20);
                        return citel.reply(`${mess4}\n\n_🎊 JackPot --> _🪙${deduff * 20}_`);
                    } else {
                        return citel.reply(`Do you understand what you are doing?`);
                    }
                } else {
                    return citel.reply(
                        "You don't have enough 💰amount in your👛 wallet.\n- Please don't provide 🤑amount.",
                    );
                }
            }
            if (f1 !== f2 && f2 !== f3) {
                const deduct1 = await eco.deduct(user, secktor, 50);
                citel.reply(`${mess1}\n\n*Big Lose -->* _🪙50_`);
            } else if (f1 == f2 && f2 == f3) {
                const give1 = await eco.give(user, secktor, 100);
                citel.reply(`${mess2}\n*_Little Jackpot -->* _🪙100_`);
            } else if (f1 == f2 && f2 !== f3) {
                const give2 = await eco.give(user, secktor, 20);
                citel.reply(`${mess3}\n*Small Win -->* _🪙20_`);
            } else if (f1 !== f2 && f1 == f3) {
                const deduct2 = await eco.deduct(user, secktor, 20);
                citel.reply(`${mess5}\n\n*Small Lose -->* _🪙20_`);
            } else if (f1 !== f2 && f2 == f3) {
                const give4 = eco.give(user, secktor, 20);
                citel.reply(`${mess3}\n\n*Small Win -->* _🪙20_`);
            } else if (f1 == f2 && f2 == f3 && f3 == f4) {
                const give5 = eco.give(user, secktor, 1000);
                citel.reply(`${mess4}\n\n_🎊 JackPot --> _🪙1000_`);
            } else {
                citel.reply(`Do you understand what you are doing?`);
            }
        } else {
            citel.reply(`*You can only play this game during weekends*\n\n*🌿 Friday*\n*🎏 Saturday*\n*🎐 Sunday*`);
        }
    },
);
