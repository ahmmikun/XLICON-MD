const { cmd, getAdmin, ui } = require('../lib');
cmd(
    {
        pattern: 'promote',
        desc: 'Provides admin role to replied/quoted user',
        category: 'group',
        filename: __filename,
        use: '<quote|reply|number>',
    },
    async (Void, citel, text) => {
        if (!citel.isGroup) return citel.reply(ui.text.group);
        const groupAdmins = await getAdmin(Void, citel);
        const botNumber = await Void.decodeJid(Void.user.id);
        const isBotAdmins = citel.isGroup ? groupAdmins.includes(botNumber) : false;
        const isAdmins = citel.isGroup ? groupAdmins.includes(citel.sender) : false;
        if (!isAdmins) return citel.reply(ui.text.admin);
        if (!isBotAdmins) return citel.reply(ui.text.botAdmin);
        try {
            let users = citel.mentionedJid[0]
                ? citel.mentionedJid[0]
                : citel.quoted
                  ? citel.quoted.sender
                  : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
            if (!users) return;
            await Void.groupParticipantsUpdate(citel.chat, [users], 'promote');
        } catch {}
    },
);
