const { cmd, ui } = require('../lib');
const { getJson } = require('../lib/api');

const SIGNS = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];

cmd(
    {
        pattern: 'horo',
        desc: 'Daily horoscope of a sign',
        use: '<sign>',
        category: 'misc',
        filename: __filename,
    },
    async (Void, citel, text) => {
        const sign = text.trim().toLowerCase();
        if (!SIGNS.includes(sign)) return citel.reply(ui.info(`Pick a sign: ${SIGNS.join(', ')}`));
        const data = await getJson(`https://ohmanda.com/api/horoscope/${sign}/`);
        return citel.reply([ui.line('🔮', 'Sign', sign), ui.line('📅', 'Date', data.date), '', data.horoscope].join('\n'));
    },
);
