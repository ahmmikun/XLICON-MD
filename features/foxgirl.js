const { cmd } = require('../lib');
const axios = require('axios');
cmd(
    {
        pattern: 'foxgirl',
        category: 'Anime Pics',
        desc: 'Sends image of Fox Girl in current chat.',
        filename: __filename,
    },
    async (conn, message) => {
        const response = await axios.get('https://nekos.life/api/v2/img/fox_girl');
        await conn.sendMessage(
            message.chat,
            {
                image: {
                    url: response.data.url,
                },
            },
            {
                quoted: message,
            },
        );
    },
);
