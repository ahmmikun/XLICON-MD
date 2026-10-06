const { cmd } = require('../lib');
const axios = require('axios');
cmd(
    {
        pattern: 'rwall',
        alias: ['wallpaper'],
        desc: 'Sends a Random Anime Wallpaper.',
        category: 'fun',
        filename: __filename,
    },
    async (Void, citel) => {
        try {
            const { data } = await axios.get('https://nekos.life/api/v2/img/wallpaper');
            return citel.imgurl(data.url, '*Here we go*');
        } catch (e) {
            return citel.reply('Error fetching wallpaper: ' + e.message);
        }
    },
);
