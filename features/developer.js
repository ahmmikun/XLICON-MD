const { cmd, Config, ui } = require('../lib');

cmd(
    {
        pattern: 'developer',
        desc: 'Project credits',
        category: 'tools',
        filename: __filename,
    },
    async (Void, citel) =>
        citel.reply(
            ui.panel('CREDITS', '🧬', [
                ui.field('🛠️', 'Main dev', 'Salman Ahmad'),
                ui.field('💻', 'Excel Amadi', 'https://github.com/Xcelsama'),
                ui.field('🔐', 'QR ideas', 'Abraham Dwamena'),
                ui.field('🐛', 'Bug fixes', 'SuhailTechInfo'),
                ui.field('🏗️', 'Base', 'SamPandey001 (Secktor-MD)'),
                ui.field('📦', 'Source', Config.github),
            ]),
        ),
);
