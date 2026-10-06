const { cmd } = require('../lib');
const axios = require('axios');
cmd(
    {
        pattern: 'define',
        desc: 'urban dictionary.',
        category: 'fun',
        filename: __filename,
    },
    async (Void, citel, text) => {
        try {
            let { data } = await axios.get(`http://api.urbandictionary.com/v0/define?term=${text}`);
            var textt = `
            Word: ${text}
            Definition: ${data.list[0].definition.replace(/\[/g, '').replace(/\]/g, '')}
            Example: ${data.list[0].example.replace(/\[/g, '').replace(/\]/g, '')}`;
            return citel.reply(textt);
        } catch {
            return citel.reply(`No result for ${text}`);
        }
    },
);
