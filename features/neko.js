const { cmd } = require('../lib');
const fetch = require('node-fetch');
cmd(
    {
        pattern: 'neko',
        category: 'Anime Pics',
        desc: 'Sends a Neko Image in chat',
        filename: __filename,
    },
    async (conn, message, query) => {
        const imageType = query.split('|')[0] || '';
        const imageCount = query.split('|')[1] || '1';
        const caption = query.split('|')[1] ? '' : 'Here we go😊!!!!';
        for (let i = 0; i < imageCount; i++) {
            let response;
            if (imageType == 'nsfw') {
                response = await fetch('https://waifu.pics/api/nsfw/neko');
            } else {
                response = await fetch('https://waifu.pics/api/sfw/neko');
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
