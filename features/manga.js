const { cmd } = require('../lib');
const { Manga } = require('@shineiichijo/marika');
cmd(
    {
        pattern: 'manga',
        category: 'Anime Pics',
        filename: __filename,
        desc: 'Sends info about asked manga.',
    },
    async (conn, message, query) => {
        const mangaClient = new Manga();
        if (!query) {
            return message.reply('Which Manga do you want to Search? \n _Please give me a name._');
        }
        const response = await mangaClient.searchManga(query);
        const manga = response.data[0];
        let mangaInfo = '*🎀Title: ' + manga.title + '*\n';
        mangaInfo += '*📈Status: ' + manga.status + '*\n';
        mangaInfo += '*🌸Total Volumes: ' + manga.volumes + '*\n';
        mangaInfo += '*🎗Total Chapters: ' + manga.chapters + '*\n';
        mangaInfo += '*🧧Genres:*\n';
        for (let i = 0; i < manga.genres.length; i++) {
            mangaInfo += '\t\t\t\t\t\t\t\t*' + manga.genres[i].name + '*\n';
        }
        mangaInfo += '*✨Published on: ' + manga.published.from + '*\n';
        mangaInfo += '*🌟Score: ' + manga.scored + '*\n';
        mangaInfo += '*🎐Popularity: ' + manga.popularity + '*\n';
        mangaInfo += '*🎏Favorites: ' + manga.favorites + '*\n';
        mangaInfo += '*✍Authors:*\n';
        for (let i = 0; i < manga.authors.length; i++) {
            mangaInfo += '\t\t\t\t\t\t\t\t\t*' + manga.authors[i].name + '* *(' + manga.authors[0].type + ')*\n';
        }
        mangaInfo += '\n*🌐URL: ' + manga.url + '*\n\n';
        if (manga.background !== null) {
            mangaInfo += '*🎆Background:* ' + manga.background;
        }
        mangaInfo += '*❄️Description:* ' + manga.synopsis;
        conn.sendMessage(
            message.chat,
            {
                image: {
                    url: manga.images.jpg.large_image_url,
                },
                caption: mangaInfo,
            },
            {
                quoted: message,
            },
        );
    },
);
