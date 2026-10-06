const { cmd, ui } = require('../lib');
const fetch = require('node-fetch');
cmd(
    {
        pattern: 'wallpaper',
        desc: 'To get Random Pics',
        category: 'Anime Pics',
        filename: __filename,
    },
    async (conn, message) => {
        const response = await fetch(
            'https://api.unsplash.com/photos/random?client_id=72utkjatCBC-PDcx7-Kcvgod7-QOFAm2fXwEeW8b8cc',
        );
        const imageData = await response.json();
        const imageUrl = imageData.urls.regular;
        const wallpaperMessage = {
            image: {
                url: imageUrl,
            },
            caption: '*---Random Wallpapers Here---*',
            footer: ui.text.footer,
            headerType: 4,
        };
        return await conn.sendMessage(message.chat, wallpaperMessage, {
            quoted: message,
        });
    },
);
