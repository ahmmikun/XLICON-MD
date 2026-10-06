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
        const caption = ui.panel('ALIVE', ui.brand.icon, [
            ui.field('🤖', 'Bot', Config.botname),
            ui.field('⏱️', 'Uptime', runtime(process.uptime())),
            ui.field('🔓', 'Mode', Config.WORKTYPE),
            ui.field('🔣', 'Prefix', ui.prefix),
            ui.field('👤', 'Owner', Config.owner.name),
            ui.field('⚡', 'Speed', `${Date.now() - started} ms`),
            '',
            ui.brand.tagline,
        ]);
        try {
            return await Void.sendMessage(citel.chat, { image: { url: await botpic() }, caption }, { quoted: citel });
        } catch (error) {
            return citel.reply(caption);
        }
    },
);
