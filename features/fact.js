const { cmd, ui } = require('../lib');
const { getJson } = require('../lib/api');

cmd(
    {
        pattern: 'fact',
        desc: 'Get a random fact',
        category: 'fun',
        filename: __filename,
    },
    async (Void, citel) => {
        const data = await getJson('https://uselessfacts.jsph.pl/api/v2/facts/random', { params: { language: 'en' } });
        return citel.reply(`${ui.font('Fact')}: ${data.text}`);
    },
);
