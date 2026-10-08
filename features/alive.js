const { cmd, runtime, botpic, Config, ui } = require('../lib');

cmd(
    {
        pattern: 'alive',
        alias: ['alive2', 'status', 'about', 'starz'],
        desc: 'Check that the bot is online',
        category: 'general',
        filename: __filename,
    },
    async (Void, citel) => {
        const started = Date.now();
        const caption = [
            `${ui.brand.icon} ${ui.font(`${Config.botname} is alive`)}`,
            ui.line('⏱️', 'Uptime', runtime(process.uptime())),
            ui.line('🔓', 'Mode', Config.WORKTYPE),
            ui.line('🔣', 'Prefix', ui.prefix),
            ui.line('👤', 'Owner', Config.owner.name),
            ui.line('⚡', 'Speed', `${Date.now() - started} ms`),
        ].join('\n');
        try {
            return await Void.sendMessage(citel.chat, { image: { url: await botpic() }, caption }, { quoted: citel });
        } catch (error) {
            return citel.reply(caption);
        }
    },
);
