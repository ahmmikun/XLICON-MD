const { cmd } = require('../lib');
const axios = require('axios');
cmd(
    {
        pattern: 'chatgpt',
        desc: 'Ask the AI a question',
        category: 'AI',
    },
    async (Void, citel, text) => {
        let question = encodeURIComponent(text.trim());
        if (!question) {
            return citel.reply('Please provide a question to ask the AI.');
        }
        try {
            let response = await axios.get(`https://rest-api.akuari.my.id/ai/gbard?chat=${question}`);
            let data = response.data;
            if (!data.respon) {
                return citel.reply("Sorry, I couldn't retrieve a response from the AI.");
            }
            await Void.sendMessage(
                citel.chat,
                {
                    text: data.respon,
                },
                {
                    quoted: citel,
                },
            );
        } catch (error) {
            citel.reply(`Error: ${error.message || error}`);
        }
    },
);
