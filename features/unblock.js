const { cmd, jsonformat, ui } = require('../lib');
cmd(
    {
        pattern: 'unblock',
        desc: 'Unblocked to the quoted user.',
        category: 'owner',
        filename: __filename,
    },
    async (Void, citel, text, { isCreator }) => {
        if (!citel.quoted) return citel.reply('Please reply to user');
        if (!isCreator) citel.reply(ui.text.owner);
        let users = citel.mentionedJid[0]
            ? citel.mentionedJid[0]
            : citel.quoted
              ? citel.quoted.sender
              : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        await Void.updateBlockStatus(users, 'unblock')
            .then((res) => console.log(jsonformat(res)))
            .catch((err) => console.log(jsonformat(err)));
    },
);
