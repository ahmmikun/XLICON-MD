const { cmd } = require('../lib');
const axios = require('axios');
cmd(
    {
        pattern: 'fact',
        desc: 'Sends fact in chat.',
        category: 'fun',
        filename: __filename,
    },
    async (Void, citel, text) => {
        const { data } = await axios.get(`https://nekos.life/api/v2/fact`);
        return citel.reply(`*Fact:* ${data.fact}\n\n*𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘 𝐒𝐓𝐀𝐑*`);
    },
);
