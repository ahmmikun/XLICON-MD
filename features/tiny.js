const { cmd } = require('../lib/');
const axios = require('axios');
cmd(
    {
        pattern: 'tiny',
        desc: 'Makes url tiny.',
        category: 'converter',
        use: '<url>',
        react: '💥',
        filename: __filename,
    },
    async (Void, citel, text) => {
        if (!text) return citel.reply('Provide me a link');
        try {
            link = text.split(' ')[0];
            anu = await axios.get(`https://tinyurl.com/api-create.php?url=${link}`);
            citel.reply(`*           xʟɪᴄᴏɴ-ǫʀ sʜᴏʀᴛᴇʀ:- 🛡️Your Shortened URL*\n\n${anu.data}`);
        } catch (e) {
            console.log(e);
        }
    },
);
