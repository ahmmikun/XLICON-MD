const { cmd, ui } = require('../lib');
const { groups, shortDesc } = require('../lib/catalog');

cmd(
    {
        pattern: 'list',
        desc: 'List every command with a short description',
        category: 'general',
        filename: __filename,
    },
    async (Void, citel) => {
        const lines = [ui.head('ALL COMMANDS', '📜'), ui.row()];
        for (const group of groups()) {
            lines.push(ui.section(`${group.label} · ${group.items.length}`, group.icon));
            for (const item of group.items) lines.push(ui.row(`${ui.prefix}${item.pattern} · ${shortDesc(item.desc)}`));
            lines.push(ui.row());
        }
        lines.push(ui.end());
        return citel.reply(lines.join('\n'));
    },
);
