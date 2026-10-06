const { cmd } = require('../lib');
const axios = require('axios');
cmd(
    {
        pattern: 'fb',
        alias: 'facebook',
        fromMe: false,
        catergory: 'downloader',
        react: '⚔️',
        desc: 'Download fb video without watermark',
    },
    async (Void, citel, text) => {
        let url = text.split(' ')[0];
        if (!text) {
            return citel.reply('Please provide a fb video URL.');
        }
        try {
            let { data } = await axios.get(`https://api-smd.vercel.app/api/fb?url=${encodeURIComponent(url)}`);
            if (!data || !data.result) return citel.reply('no results found');
            await Void.sendMessage(citel.chat, {
                video: {
                    url: data.result.urls[1].url,
                },
            });
        } catch (error) {
            citel.reply(`Error: ${error.message || error}`);
        }
    },
);
