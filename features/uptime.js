const { cmd, runtime, ui } = require('../lib');

cmd(
    {
        pattern: 'uptime',
        alias: ['runtime'],
        desc: 'Show how long the bot has been running',
        category: 'misc',
        filename: __filename,
    },
    async (Void, citel) => citel.reply(ui.line('⏱️', 'Uptime', runtime(process.uptime()))),
);
