const { cmd } = require('../lib');
const { Anime } = require('@shineiichijo/marika');
cmd(
    {
        pattern: 'anime',
        category: 'Anime Pics',
        desc: 'Searches Info about Anime and Provides result.',
    },
    async (conn, message, query) => {
        const animeClient = new Anime();
        if (!query) {
            return message.reply('Which Anime do you want to search?\n _Please give me a name._');
        }
        const response = await animeClient.searchAnime(query);
        const anime = response.data[0];
        let animeInfo = '🎀Title: ' + anime.title + '\n';
        animeInfo += '🎋Format: ' + anime.type + '\n';
        animeInfo += '*📈Status: ' + anime.status.toUpperCase().replace(/\_/g, ' ') + '*\n';
        animeInfo += '🍥Total episodes: ' + anime.episodes + '\n';
        animeInfo += '🎈Duration: ' + anime.duration + '\n';
        animeInfo += '🧧Genres:\n';
        for (let i = 0; i < anime.genres.length; i++) {
            animeInfo += '\t\t\t\t\t\t\t\t*' + anime.genres[i].name + '*\n';
        }
        animeInfo += '✨Based on: ' + anime.source.toUpperCase() + '\n';
        animeInfo += '📍Studio:\n';
        for (let i = 0; i < anime.studios.length; i++) {
            animeInfo += '\t\t\t\t\t\t\t\t*' + anime.studios[i].name + '*\n';
        }
        animeInfo += '🎴Producers:\n';
        for (let i = 0; i < anime.producers.length; i++) {
            animeInfo += '\t\t\t\t\t\t\t\t\t\t*' + anime.producers[i].name + '*\n';
        }
        animeInfo += '💫Premiered on: ' + anime.aired.from + '\n';
        animeInfo += '🎗Ended on: ' + anime.aired.to + '\n';
        animeInfo += '🎐Popularity: ' + anime.popularity + '\n';
        animeInfo += '🎏Favorites: ' + anime.favorites + '\n';
        animeInfo += '🎇Rating: ' + anime.rating + '\n';
        animeInfo += '🏅Rank: ' + anime.rank + '\n\n';
        if (anime.trailer.url !== null) {
            animeInfo += '♦Trailer: ' + anime.trailer.url + '\n\n';
        }
        animeInfo += '🌐URL: ' + anime.url + '\n\n';
        if (anime.background !== null) {
            animeInfo += '🎆Background: ' + anime.background + '*\n\n';
        }
        animeInfo += '❄Description: ' + anime.synopsis;
        conn.sendMessage(
            message.chat,
            {
                image: {
                    url: anime.images.jpg.large_image_url,
                },
                caption: animeInfo,
            },
            {
                quoted: message,
            },
        );
    },
);
