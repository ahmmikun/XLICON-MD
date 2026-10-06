const { prefix, cmd } = require('../lib');
const axios = require('axios');
cmd(
    {
        pattern: 'loli',
        category: 'Anime Pics',
        filename: __filename,
        desc: 'Sends image of loli in current chat.',
    },
    async (conn, message) => {
        const waifuData = await axios.get('https://waifu.pics/api/sfw/shinobu');
        const buttons = [
            {
                buttonId: prefix + 'loli',
                buttonText: {
                    displayText: 'Next Loli✨',
                },
                type: 1,
            },
        ];
        await conn.sendMessage(
            message.chat,
            {
                image: {
                    url: waifuData.data.url,
                },
            },
            {
                quoted: message,
            },
        );
    },
);
