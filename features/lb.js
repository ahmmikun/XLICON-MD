const { cmd } = require('../lib');
const eco = require('discord-mongoose-economy');
cmd(
    {
        pattern: 'lb',
        desc: 'check leaderboard.',
        category: 'economy',
        filename: __filename,
        react: '💷',
    },
    async (Void, citel, text, { isCreator }) => {
        let h = await eco.lb('secktor', 10);
        let str = `*Top ${h.length} users with more money in wallet.*\n`;
        const { sck1 } = require('../lib');
        let arr = [];
        for (let i = 0; i < h.length; i++) {
            let username = await sck1.findOne({
                id: h[i].userID,
            });
            var tname;
            if (username.name && username.name !== undefined) {
                tname = username.name;
            } else {
                tname = Void.getName(h[i].userID);
            }
            str += `*${i + 1}*\n╭─────────────◆\n│ *Name:-* _${tname}_\n│ *User:-* _@${h[i].userID.split('@')[0]}_\n│ *Wallet:-* _${h[i].wallet}_\n│ *Bank Amount:-* _${h[i].bank}_\n│ *Bank Capacity:-* _${h[i].bankCapacity}_\n╰─────────────◆\n\n`;
            arr.push(h[i].userID);
        }
        citel.reply(str, {
            mentions: arr,
        });
    },
);
