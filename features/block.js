const { cmd, jsonformat, ui } = require('../lib');
cmd(
    {
        pattern: 'block',
        desc: 'blocks that person',
        fromMe: true,
        category: 'owner',
        filename: __filename,
        use: '<quote/reply user.>',
    },
    async (Void, citel, text) => {
        if (!citel.quoted) return citel.reply('Please reply to user');
        if (!isCreator) citel.reply(ui.text.owner);
        let users = citel.mentionedJid[0]
            ? citel.mentionedJid[0]
            : citel.quoted
              ? citel.quoted.sender
              : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        await Void.updateBlockStatus(users, 'block')
            .then((res) => console.log(jsonformat(res)))
            .catch((err) => console.log(jsonformat(err)));
    },
);
