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
        const blocks = groups().map((group) =>
            [
                `${group.icon} ${ui.font(group.label.toUpperCase())} · ${group.items.length}`,
                ...group.items.map((item) => `▸ ${ui.prefix}${item.pattern} · ${shortDesc(item.desc)}`),
            ].join('\n'),
        );
        return citel.reply(blocks.join('\n\n'));
    },
);
