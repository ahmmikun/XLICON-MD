const { cmd, getAdmin, ui } = require('../lib');
cmd(
    {
        pattern: 'invite',
        alias: ['glink'],
        desc: 'get group link.',
        category: 'group',
        filename: __filename,
    },
    async (Void, citel, text, { isCreator }) => {
        if (!citel.isGroup) return citel.reply(ui.text.group);
        const groupAdmins = await getAdmin(Void, citel);
        const botNumber = await Void.decodeJid(Void.user.id);
        const isBotAdmins = groupAdmins.includes(botNumber);
        if (!isBotAdmins) return citel.reply(ui.text.admin);
        var str1 = await Void.groupInviteCode(citel.chat);
        var str2 = 'https://chat.whatsapp.com/';
        var mergedString = `${str2}${str1}`;
        return citel.reply('*_Group Invite Link Is Here_* \n*_' + mergedString + '_*');
    },
);
