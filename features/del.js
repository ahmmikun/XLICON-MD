const { cmd, getAdmin, ui } = require('../lib');
cmd(
    {
        pattern: 'del',
        alias: ['delete'],
        desc: 'Deletes message of any user',
        category: 'group',
        filename: __filename,
        use: '<quote/reply message.>',
    },
    async (Void, citel, text) => {
        if (citel.quoted.Bot) {
            const key = {
                remoteJid: citel.chat,
                fromMe: false,
                id: citel.quoted.id,
                participant: citel.quoted.sender,
            };
            await Void.sendMessage(citel.chat, {
                delete: key,
            });
        }
        if (!citel.quoted.isBot) {
            if (!citel.isGroup) return citel.reply(ui.text.group);
            const groupAdmins = await getAdmin(Void, citel);
            const botNumber = await Void.decodeJid(Void.user.id);
            const isBotAdmins = citel.isGroup ? groupAdmins.includes(botNumber) : false;
            const isAdmins = citel.isGroup ? groupAdmins.includes(citel.sender) : false;
            if (!isAdmins) return citel.reply('Only Admins are allowed to delete other persons message.');
            if (!isBotAdmins) return citel.reply("I can't delete anyones message without getting Admin Role.");
            if (!citel.quoted) return citel.reply(`Please reply to any message. ${ui.text.greet}`);
            let { chat, fromMe, id } = citel.quoted;
            const key = {
                remoteJid: citel.chat,
                fromMe: false,
                id: citel.quoted.id,
                participant: citel.quoted.sender,
            };
            await Void.sendMessage(citel.chat, {
                delete: key,
            });
        }
    },
);
