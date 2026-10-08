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
        const { key } = await Void.sendMessage(citel.chat, { text: '🏓' });
        const latency = Date.now() - started;
        const text = [ui.line('🏓', 'Pong', `${latency} ms`), ui.line('⏱️', 'Uptime', runtime(process.uptime()))].join('\n');
        return Void.sendMessage(citel.chat, { text, edit: key });
    },
);
