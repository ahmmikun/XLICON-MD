const { cmd, ui } = require('../lib');
const { find } = require('../lib/catalog');

cmd(
    {
        pattern: 'help',
        desc: 'How to use the bot, or details of one command',
        use: '[command]',
        category: 'general',
        filename: __filename,
    },
    async (Void, citel, text) => {
        const name = text.trim().split(/\s+/)[0].replace(ui.prefix, '').toLowerCase();

        if (!name) {
            return citel.reply(
                [
                    `📖 ${ui.font('How to use the bot')}`,
                    `▸ ${ui.prefix}menu · all commands`,
                    `▸ ${ui.prefix}menu <category> · one category`,
                    `▸ ${ui.prefix}help <command> · how a command works`,
                    `▸ ${ui.prefix}owner · contact the owner`,
                ].join('\n'),
            );
        }

        const command = find(name);
        if (!command) return citel.reply(ui.fail(`No command called "${name}".`));

        const lines = [
            ui.line('🔹', 'Command', ui.prefix + command.pattern),
            ui.line('📂', 'Category', command.category),
            ui.line('📝', 'About', command.desc || 'No description'),
        ];
        if (command.alias && command.alias.length) {
            lines.push(ui.line('🔁', 'Aliases', command.alias.map((alias) => ui.prefix + alias).join(', ')));
        }
        if (command.use && command.use.trim()) lines.push(ui.line('💡', 'Usage', `${ui.prefix}${command.pattern} ${command.use.trim()}`));
        return citel.reply(lines.join('\n'));
    },
);
