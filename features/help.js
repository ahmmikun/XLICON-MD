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
                ui.panel('HELP', '📖', [
                    `▸ ${ui.prefix}menu  all commands`,
                    `▸ ${ui.prefix}menu <category>  one category`,
                    `▸ ${ui.prefix}help <command>  usage of a command`,
                    `▸ ${ui.prefix}ping  check speed`,
                    `▸ ${ui.prefix}owner  contact the owner`,
                ]),
            );
        }

        const command = find(name);
        if (!command) return citel.reply(ui.fail(`No command called "${name}".`));

        const lines = [
            ui.field('🔹', 'Command', ui.prefix + command.pattern),
            ui.field('📂', 'Category', command.category),
            ui.field('📝', 'About', command.desc || 'No description'),
        ];
        if (command.alias && command.alias.length) {
            lines.push(ui.field('🔁', 'Aliases', command.alias.map((alias) => ui.prefix + alias).join(', ')));
        }
        if (command.use && command.use.trim()) {
            lines.push(ui.field('💡', 'Usage', `${ui.prefix}${command.pattern} ${command.use.trim()}`));
        }
        return citel.reply(ui.panel('HELP', '📖', lines));
    },
);
