const { cmd, ui } = require('../lib');

cmd(
    {
        pattern: 'attp',
        desc: 'Make an animated text sticker',
        category: 'sticker',
        filename: __filename,
    },
    async (Void, citel) => citel.reply(ui.text.working),
);
