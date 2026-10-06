const { cmd } = require('../lib');
const axios = require('axios');
cmd(
    {
        pattern: 'insult',
        desc: 'Get a random insult',
        category: 'fun',
        react: '🤥',
    },
    async (Void, citel) => {
        try {
            let response = await axios.get('https://evilinsult.com/generate_insult.php?lang=en&type=json');
            let data = response.data;
            if (!data || !data.insult) {
                return citel.reply('Unable to retrieve an insult. Please try again later.');
            }
            let insult = data.insult;
            return citel.reply(`*Insult:* ${insult}`);
        } catch (error) {
            citel.reply(`Error: ${error.message || error}`);
        }
    },
);
