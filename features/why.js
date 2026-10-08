const { cmd, ui } = require('../lib');

cmd(
    {
        pattern: 'why',
        desc: 'Ask a random why question',
        category: 'fun',
        filename: __filename,
    },
    async (Void, citel) => citel.reply(ui.text.working),
);
