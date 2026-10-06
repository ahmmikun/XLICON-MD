const { cmd } = require('../lib');
const axios = require('axios');
const Config = require('../config');
cmd(
    {
        pattern: 'naruto',
        desc: 'To get Naruto Random Videos',
        category: 'Anime Pics',
        filename: __filename,
    },
    async (conn, message) => {
        const response = await axios.get('https://raw.githubusercontent.com/mask-sir/api.mask-ser/main/Naruto.json');
        const videoList = response.data.result;
        const randomVideo = videoList[Math.floor(Math.random() * videoList.length)];
        return await conn.sendMessage(
            message.chat,
            {
                video: {
                    url: randomVideo,
                },
                caption: Config.caption,
            },
            {
                quoted: message,
            },
        );
    },
);
