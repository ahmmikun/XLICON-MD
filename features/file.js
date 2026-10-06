const path = require('path');
const { cmd, ui } = require('../lib');
const { find } = require('../lib/catalog');

cmd(
    {
        pattern: 'file',
        desc: 'Show which file a command lives in',
        use: '<command>',
        category: 'general',
        filename: __filename,
    },
    async (Void, citel, text) => {
        const command = find(text.trim().split(/\s+/)[0]);
        if (!command) return citel.reply(ui.fail('No such command.'));
        const location = path.relative(path.join(__dirname, '..'), command.filename);
        return citel.reply(
            ui.panel('FILE', '📂', [
                ui.field('🔹', 'Command', ui.prefix + command.pattern),
                ui.field('📂', 'Category', command.category),
                ui.field('📄', 'File', location),
            ]),
        );
    },
);
