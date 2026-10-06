const { cmd } = require('../lib');
const axios = require('axios');
cmd(
    {
        pattern: 'why',
        desc: 'Sends a why question!!',
        category: 'fun',
        filename: __filename,
    },
    async (Void, citel) => {
        try {
            const { data } = await axios.get('https://nekos.life/api/v2/why');
            return citel.reply('```' + data.why + '```');
        } catch (e) {
            return citel.reply('Error fetching question: ' + e.message);
        }
    },
);
