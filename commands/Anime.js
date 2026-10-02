const Config = require("../config");

const {
    fancytext,
    tlang,
    tiny,
    runtime,
    formatp,
    botpic,
    prefix,
    sck1,
    cmd,
    GIFBufferToVideoBuffer
} = require("../lib");

const axios = require("axios");
const fetch = require("node-fetch");

const { Anime, Manga } = require("@shineiichijo/marika");

const {
    fetchJson,
    getBuffer
} = require("../lib/");


// ==========================================
// POKE COMMAND
// ==========================================

cmd({
    pattern: "poke",
    category: "reaction",
    use: "<quote|reply|tag>"
}, async (conn, message) => {

    const apiResponse = await fetchJson(
        "https://api.waifu.pics/sfw/poke"
    );

    const imageResponse = await axios.get(apiResponse.url, {
        responseType: "arraybuffer"
    });

    const gifBuffer = Buffer.from(imageResponse.data, "utf-8");

    const targetUser = message.mentionedJid
        ? message.mentionedJid[0]
        : message.msg.contextInfo.participant || false;

    const videoBuffer = await GIFBufferToVideoBuffer(gifBuffer);

    if (targetUser) {

        const caption =
            "@" + message.sender.split("@")[0] +
            " poked to @" + targetUser.split("@")[0] + " ";

        conn.sendMessage(message.chat, {
            video: videoBuffer,
            gifPlayback: true,
            mentions: [targetUser, message.sender],
            caption: caption
        }, {
            quoted: message
        });

    } else {

        const caption =
            "@" + message.sender.split("@")[0] +
            " poked to everyone. ";

        conn.sendMessage(message.chat, {
            video: videoBuffer,
            gifPlayback: true,
            mentions: [message.sender],
            caption: caption
        }, {
            quoted: message
        });
    }
});


// ==========================================
// HUG COMMAND
// ==========================================

cmd({
    pattern: "hug",
    category: "reaction",
    use: "<quote|reply|tag>"
}, async (conn, message) => {

    const apiResponse = await fetchJson(
        "https://api.waifu.pics/sfw/hug"
    );

    const imageResponse = await axios.get(apiResponse.url, {
        responseType: "arraybuffer"
    });

    const gifBuffer = Buffer.from(imageResponse.data, "utf-8");

    const targetUser = message.mentionedJid
        ? message.mentionedJid[0]
        : message.msg.contextInfo.participant || false;

    const videoBuffer = await GIFBufferToVideoBuffer(gifBuffer);

    if (targetUser) {

        const caption =
            "@" + message.sender.split("@")[0] +
            " hug to @" + targetUser.split("@")[0] + " ";

        conn.sendMessage(message.chat, {
            video: videoBuffer,
            gifPlayback: true,
            mentions: [targetUser, message.sender],
            caption: caption
        }, {
            quoted: message
        });

    } else {

        const caption =
            "@" + message.sender.split("@")[0] +
            " huged to everyone. ";

        conn.sendMessage(message.chat, {
            video: videoBuffer,
            gifPlayback: true,
            mentions: [message.sender],
            caption: caption
        }, {
            quoted: message
        });
    }
});


// ==========================================
// HOLD HAND COMMAND
// ==========================================

cmd({
    pattern: "hold",
    category: "reaction",
    use: "<quote|reply|tag>"
}, async (conn, message) => {

    const apiResponse = await fetchJson(
        "https://api.waifu.pics/sfw/handhold"
    );

    const imageResponse = await axios.get(apiResponse.url, {
        responseType: "arraybuffer"
    });

    const gifBuffer = Buffer.from(imageResponse.data, "utf-8");

    const targetUser = message.mentionedJid
        ? message.mentionedJid[0]
        : message.msg.contextInfo.participant || false;

    const videoBuffer = await GIFBufferToVideoBuffer(gifBuffer);

    if (targetUser) {

        const caption =
            "@" + message.sender.split("@")[0] +
            " hold hand of @" + targetUser.split("@")[0] + " ";

        conn.sendMessage(message.chat, {
            video: videoBuffer,
            gifPlayback: true,
            mentions: [targetUser, message.sender],
            caption: caption
        }, {
            quoted: message
        });

    } else {

        const caption =
            "@" + message.sender.split("@")[0] +
            " holed to everyone. ";

        conn.sendMessage(message.chat, {
            video: videoBuffer,
            gifPlayback: true,
            mentions: [message.sender],
            caption: caption
        }, {
            quoted: message
        });
    }
});


// ==========================================
// HIGH FIVE COMMAND
// ==========================================

cmd({
    pattern: "hifi",
    category: "reaction",
    use: "<quote|reply|tag>"
}, async (conn, message) => {

    const apiResponse = await fetchJson(
        "https://api.waifu.pics/sfw/highfive"
    );

    const imageResponse = await axios.get(apiResponse.url, {
        responseType: "arraybuffer"
    });

    const gifBuffer = Buffer.from(imageResponse.data, "utf-8");

    const targetUser = message.mentionedJid
        ? message.mentionedJid[0]
        : message.msg.contextInfo.participant || false;

    const videoBuffer = await GIFBufferToVideoBuffer(gifBuffer);

    if (targetUser) {

        const caption =
            "@" + message.sender.split("@")[0] +
            " highfive with @" + targetUser.split("@")[0] + " ";

        conn.sendMessage(message.chat, {
            video: videoBuffer,
            gifPlayback: true,
            mentions: [targetUser, message.sender],
            caption: caption
        }, {
            quoted: message
        });

    } else {

        const caption =
            "@" + message.sender.split("@")[0] +
            " highfived with everyone. ";

        conn.sendMessage(message.chat, {
            video: videoBuffer,
            gifPlayback: true,
            mentions: [message.sender],
            caption: caption
        }, {
            quoted: message
        });
    }
});


// ==========================================
// WAIFU IMAGE COMMAND
// ==========================================

cmd({
    pattern: "waifu",
    desc: "To get Waifu Random Pics",
    category: "Anime Pics",
    filename: __filename
}, async (conn, message, query) => {

    const imageType = query.split("|")[0] || "";
    const imageCount = query.split("|")[1] || "1";

    const caption = query.split("|")[1]
        ? ""
        : "---Waifu Pics Here---";

    for (let i = 0; i < imageCount; i++) {

        let response;

        if (imageType == "nsfw") {

            response = await fetch(
                "https://api.waifu.pics/nsfw/waifu"
            );

        } else {

            response = await fetch(
                "https://api.waifu.pics/sfw/waifu"
            );
        }

        const imageData = await response.json();

        const imageMessage = {
            image: {
                url: imageData.url
            },
            caption: caption,
            headerType: 1
        };

        await conn.sendMessage(
            message.chat,
            imageMessage,
            {
                quoted: message
            }
        );
    }
});


// ==========================================
// NARUTO VIDEO COMMAND
// ==========================================

cmd({
    pattern: "naruto",
    desc: "To get Naruto Random Videos",
    category: "Anime Pics",
    filename: __filename
}, async (conn, message) => {

    const response = await axios.get(
        "https://raw.githubusercontent.com/mask-sir/api.mask-ser/main/Naruto.json"
    );

    const videoList = response.data.result;

    const randomVideo = videoList[
        Math.floor(Math.random() * videoList.length)
    ];

    return await conn.sendMessage(message.chat, {
        video: {
            url: randomVideo
        },
        caption: Config.caption
    }, {
        quoted: message
    });
});


// ==========================================
// NEKO IMAGE COMMAND
// ==========================================

cmd({
    pattern: "neko",
    category: "Anime Pics",
    desc: "Sends a Neko Image in chat",
    filename: __filename
}, async (conn, message, query) => {

    const imageType = query.split("|")[0] || "";
    const imageCount = query.split("|")[1] || "1";

    const caption = query.split("|")[1]
        ? ""
        : "Here we go😊!!!!";

    for (let i = 0; i < imageCount; i++) {

        let response;

        if (imageType == "nsfw") {

            response = await fetch(
                "https://waifu.pics/api/nsfw/neko"
            );

        } else {

            response = await fetch(
                "https://waifu.pics/api/sfw/neko"
            );
        }

        const imageData = await response.json();

        const imageMessage = {
            image: {
                url: imageData.url
            },
            caption: caption,
            headerType: 1
        };

        await conn.sendMessage(
            message.chat,
            imageMessage,
            {
                quoted: message
            }
        );
    }
});


// ==========================================
// FOX GIRL IMAGE COMMAND
// ==========================================

cmd({
    pattern: "foxgirl",
    category: "Anime Pics",
    desc: "Sends image of Fox Girl in current chat.",
    filename: __filename
}, async (conn, message) => {

    const response = await axios.get(
        "https://nekos.life/api/v2/img/fox_girl"
    );

    await conn.sendMessage(message.chat, {
        image: {
            url: response.data.url
        }
    }, {
        quoted: message
    });
});


// ==========================================
// ANIME NEWS COMMAND
// ==========================================

cmd({
    pattern: "animenews",
    category: "Anime Pics",
    desc: "Sends Anime News in chat",
    filename: __filename
}, async (conn, message) => {

    const searchQueries = [
        "Anime News Today",
        "New Anime",
        "Uocoming Anime News",
        "New Anime Info",
        "Whats news in Anime",
        "Anime Series",
        "Manga News today",
        "Anime New News",
        "Anime News today"
    ];

    const randomQuery = searchQueries[
        Math.floor(Math.random() * searchQueries.length)
    ];

    const apiUrl =
        "https://newsapi.org/v2/everything?q=" +
        randomQuery +
        "&domains=techcrunch.com,animenewsnetwork.com,myanimelist.net,comingsoon.net,crunchyroll.com" +
        "&language=en" +
        "&sortby=publishedat" +
        "&apikey=cd4116be09ef4a0caceedf21b6258460" +
        "&pageSize=8";

    const response = await axios.get(apiUrl);

    const articles = response.data.articles;

    articles.map(async (article) => {

        await conn.sendMessage(message.chat, {

            image: {
                url: article.urlToImage
            },

            caption:
                "*Title🔰:* " + article.title +
                "\n\n*Content🧩:* " + article.content +
                "\n*Author📌:* " + article.author +
                "\n*Source♦️:* " + article.source.name +
                "\n*Created On☘️:* " + article.publishedAt +
                "\n*More on✨:* " + article.url +
                "\n\n*Powered by " + tlang().title + "*"

        }, {
            quoted: message
        });
    });
});


// ==========================================
// LOLI / SHINOBU IMAGE COMMAND
// ==========================================

cmd({
    pattern: "loli",
    category: "Anime Pics",
    filename: __filename,
    desc: "Sends image of loli in current chat."
}, async (conn, message) => {

    const waifuData = await axios.get(
        "https://waifu.pics/api/sfw/shinobu"
    );

    const buttons = [
        {
            buttonId: prefix + "loli",
            buttonText: {
                displayText: "Next Loli✨"
            },
            type: 1
        }
    ];

    await conn.sendMessage(message.chat, {
        image: {
            url: waifuData.data.url
        }
    }, {
        quoted: message
    });
});


// ==========================================
// POKEMON INFORMATION COMMAND
// ==========================================

cmd({
    pattern: "pokemon",
    category: "Anime Pics",
    filename: __filename,
    desc: "Sends info of pokemon in current chat."
}, async (conn, message, query) => {

    if (!query) {
        return message.reply(
            "```Uhh Please Give Me Poki Name```"
        );
    }

    try {

        const response = await axios.get(
            "https://pokeapi.co/api/v2/pokemon/" + query
        );

        const pokemon = response.data;

        if (!pokemon.name) {
            return message.reply(
                "❌ Could not found any pokemon with that name"
            );
        }

        const pokemonInfo =
            "*•Name: " + pokemon.name + "*\n" +
            "*•Pokedex ID: " + pokemon.id + "*\n" +
            "*•Height: " + pokemon.height + "*\n" +
            "*•Weight: " + pokemon.weight + "*\n" +
            "*•Abilities: " +
            pokemon.abilities[0].ability.name +
            ", " +
            pokemon.abilities[1].ability.name +
            "*\n" +
            "*•Base Experience: " + pokemon.base_experience + "*\n" +
            "*•Type: " + pokemon.types[0].type.name + "*\n" +
            "*•Base Stat: " + pokemon.stats[0].base_stat + "*\n" +
            "*•Attack: " + pokemon.stats[1].base_stat + "*\n" +
            "*•Defense: " + pokemon.stats[2].base_stat + "*\n" +
            "*•Special Attack: " + pokemon.stats[3].base_stat + "*\n" +
            "*•Special Defense: " + pokemon.stats[4].base_stat + "*\n" +
            "*•Speed: " + pokemon.stats[5].base_stat + "*\n";

        conn.sendMessage(message.chat, {

            image: {
                url: pokemon.sprites.front_default
            },

            caption: pokemonInfo

        }, {
            quoted: message
        });

    } catch (error) {

        message.reply(
            "Ahh,Couldn't found any pokemon."
        );
    }
});


// ==========================================
// MANGA INFORMATION COMMAND
// ==========================================

cmd({
    pattern: "manga",
    category: "Anime Pics",
    filename: __filename,
    desc: "Sends info about asked manga."
}, async (conn, message, query) => {

    const mangaClient = new Manga();

    if (!query) {
        return message.reply(
            "Which Manga do you want to Search? \n _Please give me a name._"
        );
    }

    const response = await mangaClient.searchManga(query);

    const manga = response.data[0];

    let mangaInfo =
        "*🎀Title: " + manga.title + "*\n";

    mangaInfo +=
        "*📈Status: " + manga.status + "*\n";

    mangaInfo +=
        "*🌸Total Volumes: " + manga.volumes + "*\n";

    mangaInfo +=
        "*🎗Total Chapters: " + manga.chapters + "*\n";

    mangaInfo += "*🧧Genres:*\n";

    for (let i = 0; i < manga.genres.length; i++) {

        mangaInfo +=
            "\t\t\t\t\t\t\t\t*" +
            manga.genres[i].name +
            "*\n";
    }

    mangaInfo +=
        "*✨Published on: " + manga.published.from + "*\n";

    mangaInfo +=
        "*🌟Score: " + manga.scored + "*\n";

    mangaInfo +=
        "*🎐Popularity: " + manga.popularity + "*\n";

    mangaInfo +=
        "*🎏Favorites: " + manga.favorites + "*\n";

    mangaInfo += "*✍Authors:*\n";

    for (let i = 0; i < manga.authors.length; i++) {

        mangaInfo +=
            "\t\t\t\t\t\t\t\t\t*" +
            manga.authors[i].name +
            "* *(" +
            manga.authors[0].type +
            ")*\n";
    }

    mangaInfo +=
        "\n*🌐URL: " + manga.url + "*\n\n";

    if (manga.background !== null) {

        mangaInfo +=
            "*🎆Background:* " + manga.background;
    }

    mangaInfo +=
        "*❄️Description:* " + manga.synopsis;

    conn.sendMessage(message.chat, {

        image: {
            url: manga.images.jpg.large_image_url
        },

        caption: mangaInfo

    }, {
        quoted: message
    });
});


// ==========================================
// ANIME INFORMATION COMMAND
// ==========================================

cmd({
    pattern: "anime",
    category: "Anime Pics",
    desc: "Searches Info about Anime and Provides result."
}, async (conn, message, query) => {

    const animeClient = new Anime();

    if (!query) {
        return message.reply(
            "Which Anime do you want to search?\n _Please give me a name._"
        );
    }

    const response = await animeClient.searchAnime(query);

    const anime = response.data[0];

    let animeInfo =
        "🎀Title: " + anime.title + "\n";

    animeInfo +=
        "🎋Format: " + anime.type + "\n";

    animeInfo +=
        "*📈Status: " +
        anime.status.toUpperCase().replace(/\_/g, " ") +
        "*\n";

    animeInfo +=
        "🍥Total episodes: " + anime.episodes + "\n";

    animeInfo +=
        "🎈Duration: " + anime.duration + "\n";

    animeInfo += "🧧Genres:\n";

    for (let i = 0; i < anime.genres.length; i++) {

        animeInfo +=
            "\t\t\t\t\t\t\t\t*" +
            anime.genres[i].name +
            "*\n";
    }

    animeInfo +=
        "✨Based on: " + anime.source.toUpperCase() + "\n";

    animeInfo += "📍Studio:\n";

    for (let i = 0; i < anime.studios.length; i++) {

        animeInfo +=
            "\t\t\t\t\t\t\t\t*" +
            anime.studios[i].name +
            "*\n";
    }

    animeInfo += "🎴Producers:\n";

    for (let i = 0; i < anime.producers.length; i++) {

        animeInfo +=
            "\t\t\t\t\t\t\t\t\t\t*" +
            anime.producers[i].name +
            "*\n";
    }

    animeInfo +=
        "💫Premiered on: " + anime.aired.from + "\n";

    animeInfo +=
        "🎗Ended on: " + anime.aired.to + "\n";

    animeInfo +=
        "🎐Popularity: " + anime.popularity + "\n";

    animeInfo +=
        "🎏Favorites: " + anime.favorites + "\n";

    animeInfo +=
        "🎇Rating: " + anime.rating + "\n";

    animeInfo +=
        "🏅Rank: " + anime.rank + "\n\n";

    if (anime.trailer.url !== null) {

        animeInfo +=
            "♦Trailer: " + anime.trailer.url + "\n\n";
    }

    animeInfo +=
        "🌐URL: " + anime.url + "\n\n";

    if (anime.background !== null) {

        animeInfo +=
            "🎆Background: " + anime.background + "*\n\n";
    }

    animeInfo +=
        "❄Description: " + anime.synopsis;

    conn.sendMessage(message.chat, {

        image: {
            url: anime.images.jpg.large_image_url
        },

        caption: animeInfo

    }, {
        quoted: message
    });
});


// ==========================================
// WALLPAPER COMMAND
// ==========================================

cmd({
    pattern: "wallpaper",
    desc: "To get Random Pics",
    category: "Anime Pics",
    filename: __filename
}, async (conn, message) => {

    const response = await fetch(
        "https://api.unsplash.com/photos/random?client_id=72utkjatCBC-PDcx7-Kcvgod7-QOFAm2fXwEeW8b8cc"
    );

    const imageData = await response.json();

    const imageUrl = imageData.urls.regular;

    const wallpaperMessage = {

        image: {
            url: imageUrl
        },

        caption: "*---Random Wallpapers Here---*",

        footer: tlang().footer,

        headerType: 4
    };

    return await conn.sendMessage(
        message.chat,
        wallpaperMessage,
        {
            quoted: message
        }
    );
});

