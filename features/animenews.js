const { cmd, ui } = require('../lib');
const { getJson } = require('../lib/api');

const clean = (value) => value.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, '').trim();

cmd(
    {
        pattern: 'animenews',
        desc: 'Latest anime news',
        category: 'anime',
        filename: __filename,
    },
    async (Void, citel) => {
        const xml = await getJson('https://www.animenewsnetwork.com/all/rss.xml', { responseType: 'text', transformResponse: (body) => body });
        const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 5).map(([, item]) => {
            const field = (name) => clean((item.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`)) || [, ''])[1]);
            return `📰 *${field('title')}*\n${field('link')}`;
        });
        if (!items.length) return citel.reply(ui.fail('No news right now.'));
        return citel.reply(items.join('\n\n'));
    },
);
