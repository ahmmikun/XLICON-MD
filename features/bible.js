const { cmd } = require('../lib');
const axios = require('axios');
cmd(
    {
        pattern: 'bible',
        desc: 'Get a Bible verse',
        category: 'RELIGION',
        react: '🧎‍♂️',
    },
    async (Void, citel, text) => {
        let verseReference = text.trim();
        if (!verseReference) {
            return citel.reply('Please provide a valid Bible verse reference.');
        }
        try {
            let response = await axios.get(`https://bible-api.com/${encodeURIComponent(verseReference)}`);
            let data = response.data;
            if (!data || !data.verses || data.verses.length === 0) {
                return citel.reply('Unable to retrieve the Bible verse. Please check the reference and try again.');
            }
            let verseText = data.verses[0].text;
            let translationName = data.translation_name;
            return citel.reply(`*${verseReference} (${translationName}):*\n${verseText}`);
        } catch (error) {
            citel.reply(`Error: ${error.message || error}`);
        }
    },
);
