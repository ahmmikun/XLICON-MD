const { cmd } = require('../lib');
const axios = require('axios');
cmd(
    {
        pattern: 'rizz',
        category: 'fun',
        desc: 'Get a random pickup line',
        react: '🙈',
    },
    async (Void, citel) => {
        try {
            let response = await axios.get('https://vinuxd.vercel.app/api/pickup');
            let data = response.data;
            if (!data || !data.pickup) {
                return citel.reply('Unable to retrieve a pickup line. Please try again later.');
            }
            let pickupLine = data.pickup;
            return citel.reply(`*Pickup Line:* ${pickupLine}`);
        } catch (error) {
            citel.reply(`Error: ${error.message || error}`);
        }
    },
);
