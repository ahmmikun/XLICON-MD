const { cmd, getAdmin, ui } = require('../lib');
cmd(
    {
        pattern: 'add',
        desc: 'Add that person in group',
        fromMe: true,
        category: 'group',
        filename: __filename,
        use: '<number>',
    },
    async (Void, citel, text, { isCreator }) => {
        if (!citel.isGroup) return citel.reply(ui.text.group);
        const groupAdmins = await getAdmin(Void, citel);
        const botNumber = await Void.decodeJid(Void.user.id);
        const isBotAdmins = citel.isGroup ? groupAdmins.includes(botNumber) : false;
        const isAdmins = citel.isGroup ? groupAdmins.includes(citel.sender) : false;
        if (!text) return citel.reply('Please provide me number.');
        if (!isCreator) return citel.reply(ui.text.owner);
        if (!isBotAdmins) return citel.reply(ui.text.botAdmin);
        let users = citel.mentionedJid[0]
            ? citel.mentionedJid[0]
            : citel.quoted
              ? citel.quoted.sender
              : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        await Void.groupParticipantsUpdate(citel.chat, [users], 'add');
    },
);
