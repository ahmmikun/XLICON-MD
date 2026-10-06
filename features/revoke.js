const { cmd, getAdmin, ui } = require('../lib');
cmd(
    {
        pattern: 'revoke',
        desc: 'reset group link.',
        category: 'group',
        filename: __filename,
    },
    async (Void, citel, text, { isCreator }) => {
        if (!citel.isGroup) return citel.reply(ui.text.group);
        const groupAdmins = await getAdmin(Void, citel);
        const botNumber = await Void.decodeJid(Void.user.id);
        const isBotAdmins = groupAdmins.includes(botNumber);
        if (!isBotAdmins) return citel.reply(ui.text.admin);
        var code = await Void.groupRevokeInvite(citel.chat);
        return citel.reply('*_Group Link Revoked SuccesFully_*');
    },
);
