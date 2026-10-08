const { cmd, ui } = require('../lib');
const { getJson } = require('../lib/api');

cmd(
    {
        pattern: 'npm',
        desc: 'Search npm packages',
        use: '<package name>',
        category: 'search',
        filename: __filename,
    },
    async (Void, citel, text) => {
        const query = text.trim();
        if (!query) return citel.reply(ui.info(`Give me a package name, e.g. ${ui.prefix}npm express`));
        const data = await getJson('https://registry.npmjs.org/-/v1/search', { params: { text: query, size: 5 } });
        if (!data.objects.length) return citel.reply(ui.fail(`No package found for "${query}".`));
        const lines = data.objects.map(({ package: pack }) =>
            [`📦 *${pack.name}* v${pack.version}`, pack.description || '', pack.links.npm].filter(Boolean).join('\n'),
        );
        return citel.reply(lines.join('\n\n'));
    },
);
