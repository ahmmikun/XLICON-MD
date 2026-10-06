const { cmd } = require('../lib');
const fetch = require('node-fetch');
cmd(
    {
        pattern: 'waifu',
        desc: 'To get Waifu Random Pics',
        category: 'Anime Pics',
        filename: __filename,
    },
    async (conn, message, query) => {
        const imageType = query.split('|')[0] || '';
        const imageCount = query.split('|')[1] || '1';
        const caption = query.split('|')[1] ? '' : '---Waifu Pics Here---';
        for (let i = 0; i < imageCount; i++) {
            let response;
            if (imageType == 'nsfw') {
                response = await fetch('https://api.waifu.pics/nsfw/waifu');
            } else {
                response = await fetch('https://api.waifu.pics/sfw/waifu');
            }
            const imageData = await response.json();
            const imageMessage = {
                image: {
                    url: imageData.url,
                },
                caption: caption,
                headerType: 1,
            };
            await conn.sendMessage(message.chat, imageMessage, {
                quoted: message,
            });
        }
    },
);
