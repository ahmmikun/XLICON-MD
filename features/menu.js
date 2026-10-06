const { cmd, runtime, ui, botpic, Config } = require('../lib');
const { getMenuInfo } = require('../lib/menuInfo');
const { groups, shortDesc } = require('../lib/catalog');

const ROW_WIDTH = 30;

const rows = (names) => {
    const lines = [];
    let current = '';
    for (const name of names) {
        const next = current ? `${current} · ${name}` : name;
        if (current && next.length > ROW_WIDTH) {
            lines.push(current);
            current = name;
        } else {
            current = next;
        }
    }
    if (current) lines.push(current);
    return lines;
};

const overview = (info, all) => {
    const total = all.reduce((sum, group) => sum + group.items.length, 0);
    const lines = [
        ui.head(`${ui.brand.name} · ${ui.brand.title}`),
        ui.row(),
        ui.row(`👋 ${info.greeting}`),
        ui.row(`🕐 ${info.time}`),
        ui.row(`🌦️ ${info.weather} · ${info.place}`),
        ui.row(),
        ui.row(`📦 ${total} commands  🔣 Prefix [ ${ui.prefix} ]`),
        ui.row(`⏱️ Up ${runtime(process.uptime())}  🔓 ${Config.WORKTYPE}`),
        ui.row(`⚡ ${ui.brand.tagline}`),
        ui.row(),
    ];
    for (const group of all) {
        lines.push(ui.section(`${group.label} · ${group.items.length}`, group.icon));
        rows(group.items.map((item) => ui.prefix + item.pattern)).forEach((line) => lines.push(ui.row(line)));
        lines.push(ui.row());
    }
    lines.push(ui.end());
    lines.push(`💡 ${ui.prefix}menu <category> for details`);
    lines.push(`💡 ${ui.prefix}help <command> for usage`);
    return lines.join('\n');
};

const category = (group) => {
    const lines = [ui.head(`${group.label} · ${group.items.length}`, group.icon), ui.row()];
    for (const item of group.items) {
        lines.push(ui.row(`▸ ${ui.prefix}${item.pattern}`));
        lines.push(ui.row(`   ${shortDesc(item.desc)}`));
    }
    lines.push(ui.row(), ui.end());
    return lines.join('\n');
};

cmd(
    {
        pattern: 'menu',
        desc: 'Show all commands, or one category',
        use: '[category]',
        category: 'general',
        filename: __filename,
    },
    async (Void, citel, text) => {
        const all = groups();
        const query = text.trim().toLowerCase();

        if (query) {
            const group = all.find((item) => item.key === query) || all.find((item) => item.key.includes(query));
            if (!group) {
                const names = all.map((item) => item.key).join(', ');
                return citel.reply(`${ui.fail(`No category called "${query}".`)}\n\n📂 ${names}`);
            }
            return citel.reply(category(group));
        }

        const caption = overview(await getMenuInfo(citel.pushName), all);
        try {
            return await Void.sendMessage(citel.chat, { image: { url: await botpic() }, caption }, { quoted: citel });
        } catch (error) {
            return citel.reply(caption);
        }
    },
);
