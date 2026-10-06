const { cmd, ui } = require('../lib');
const axios = require('axios');
cmd(
    {
        pattern: 'animenews',
        category: 'Anime Pics',
        desc: 'Sends Anime News in chat',
        filename: __filename,
    },
    async (conn, message) => {
        const searchQueries = [
            'Anime News Today',
            'New Anime',
            'Uocoming Anime News',
            'New Anime Info',
            'Whats news in Anime',
            'Anime Series',
            'Manga News today',
            'Anime New News',
            'Anime News today',
        ];
        const randomQuery = searchQueries[Math.floor(Math.random() * searchQueries.length)];
        const apiUrl =
            'https://newsapi.org/v2/everything?q=' +
            randomQuery +
            '&domains=techcrunch.com,animenewsnetwork.com,myanimelist.net,comingsoon.net,crunchyroll.com' +
            '&language=en' +
            '&sortby=publishedat' +
            '&apikey=cd4116be09ef4a0caceedf21b6258460' +
            '&pageSize=8';
        const response = await axios.get(apiUrl);
        const articles = response.data.articles;
        articles.map(async (article) => {
            await conn.sendMessage(
                message.chat,
                {
                    image: {
                        url: article.urlToImage,
                    },
                    caption:
                        '*Title🔰:* ' +
                        article.title +
                        '\n\n*Content🧩:* ' +
                        article.content +
                        '\n*Author📌:* ' +
                        article.author +
                        '\n*Source♦️:* ' +
                        article.source.name +
                        '\n*Created On☘️:* ' +
                        article.publishedAt +
                        '\n*More on✨:* ' +
                        article.url +
                        '\n\n*Powered by ' +
                        ui.text.title +
                        '*',
                },
                {
                    quoted: message,
                },
            );
        });
    },
);
