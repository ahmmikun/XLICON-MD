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
            [
                ui.line('🛠️', 'Main dev', 'Salman Ahmad'),
                ui.line('💻', 'Excel Amadi', 'https://github.com/Xcelsama'),
                ui.line('🔐', 'QR ideas', 'Abraham Dwamena'),
                ui.line('🐛', 'Bug fixes', 'SuhailTechInfo'),
                ui.line('🏗️', 'Base', 'SamPandey001 (Secktor-MD)'),
                ui.line('📦', 'Source', Config.github),
            ].join('\n'),
        ),
);
