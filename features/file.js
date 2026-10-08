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
        return citel.reply(
            [
                ui.line('🔹', 'Command', ui.prefix + command.pattern),
                ui.line('📂', 'Category', command.category),
                ui.line('📄', 'File', path.relative(path.join(__dirname, '..'), command.filename)),
            ].join('\n'),
        );
    },
);
