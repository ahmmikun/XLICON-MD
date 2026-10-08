const { cmd, runtime, ui, botpic, Config } = require('../lib');
const { getMenuInfo } = require('../lib/menuInfo');
const { groups, shortDesc } = require('../lib/catalog');

const header = (info, total) =>
    [
        ui.menu.header,
        `${ui.menu.row}👋 ${info.greeting}`,
        `${ui.menu.row}🕐 ${info.time}`,
        `${ui.menu.row}🌦️ ${info.weather} · ${info.place}`,
        `${ui.menu.row}📦 ${total} commands · Prefix [ ${ui.prefix} ]`,
        `${ui.menu.row}⏱️ Up ${runtime(process.uptime())} · 🔓 ${Config.WORKTYPE}`,
        ui.menu.footer,
    ].join('\n');

const block = (group, withDescriptions) =>
    [
        `${ui.menu.categoryHeader} ${group.icon} ${ui.font(group.label.toUpperCase())} · ${group.items.length} ${ui.menu.categoryFooter}`,
        ...group.items.map(
            (item) => `${ui.menu.commandPrefix}${ui.prefix}${item.pattern}${withDescriptions ? ` — ${shortDesc(item.desc)}` : ''}`,
        ),
        ui.menu.footer,
    ].join('\n');

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
            return citel.reply(block(group, true));
        }

        const total = all.reduce((sum, group) => sum + group.items.length, 0);
        const tips = `💡 ${ui.prefix}menu <category> · ${ui.prefix}help <command>`;
        const caption = [header(await getMenuInfo(citel.pushName), total), ...all.map((group) => block(group, false)), tips].join('\n\n');
        try {
            return await Void.sendMessage(citel.chat, { image: { url: await botpic() }, caption }, { quoted: citel });
        } catch (error) {
            return citel.reply(caption);
        }
    },
);
