const { cmd } = require('../lib');
cmd(
    {
        pattern: 'support',
        desc: 'Sends official support link.',
        category: 'group',
        filename: __filename,
    },
    async (Void, citel, text) => {
        await Void.sendMessage(`${citel.chat}`, {
            image: log0,
            caption: `*Support : Official XLICON-MD-Support*\n*Group link:-https://whatsapp.com/channel/0029Va9wmuz8F2pGIURwmo0m`,
        });
    },
);
