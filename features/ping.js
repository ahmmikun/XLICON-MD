const { cmd, runtime, ui } = require('../lib');

cmd(
    {
        pattern: 'ping',
        desc: 'Check the bot speed',
        category: 'general',
        filename: __filename,
    },
    async (Void, citel) => {
        const started = Date.now();
        const { key } = await Void.sendMessage(citel.chat, { text: ui.info('Pinging...') });
        const latency = Date.now() - started;
        const panel = ui.panel('PONG', '🏓', [
            ui.field('⚡', 'Speed', `${latency} ms`),
            ui.field('⏱️', 'Uptime', runtime(process.uptime())),
        ]);
        return Void.sendMessage(citel.chat, { text: panel, edit: key });
    },
);
