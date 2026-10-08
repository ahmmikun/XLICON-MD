const { cmd, ui } = require('../lib');

cmd(
    {
        pattern: 'wamod',
        desc: 'Get a WhatsApp mod',
        category: 'misc',
        filename: __filename,
    },
    async (Void, citel) => citel.reply(ui.text.working),
);
