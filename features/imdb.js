const { cmd, Config, ui } = require('../lib');
const axios = require('axios');
cmd(
    {
        pattern: 'imdb',
        category: 'search',
        desc: 'Sends image of asked Movie/Series.',
        use: '<text>',
        filename: __filename,
    },
    async (Void, citel, text) => {
        if (!text) return citel.reply(`_Name a Series or movie ${ui.text.greet}._`);
        if (!Config.keys.omdb) return citel.reply(ui.text.working);
        let fids = await axios.get('https://www.omdbapi.com/', { params: { apikey: Config.keys.omdb, t: text, plot: 'full' } });
        if (fids.data.Response === 'False') return citel.reply(ui.fail(`I could not find "${text}".`));
        let imdbt = '';
        imdbt += '⚍⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚍\n' + ' ``` 𝕀𝕄𝔻𝔹 𝕊𝔼𝔸ℝℂℍ```\n' + '⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎\n';
        imdbt += '🎬Title      : ' + fids.data.Title + '\n';
        imdbt += '📅Year       : ' + fids.data.Year + '\n';
        imdbt += '⭐Rated      : ' + fids.data.Rated + '\n';
        imdbt += '📆Released   : ' + fids.data.Released + '\n';
        imdbt += '⏳Runtime    : ' + fids.data.Runtime + '\n';
        imdbt += '🌀Genre      : ' + fids.data.Genre + '\n';
        imdbt += '👨🏻‍💻Director   : ' + fids.data.Director + '\n';
        imdbt += '✍Writer     : ' + fids.data.Writer + '\n';
        imdbt += '👨Actors     : ' + fids.data.Actors + '\n';
        imdbt += '📃Plot       : ' + fids.data.Plot + '\n';
        imdbt += '🌐Language   : ' + fids.data.Language + '\n';
        imdbt += '🌍Country    : ' + fids.data.Country + '\n';
        imdbt += '🎖️Awards     : ' + fids.data.Awards + '\n';
        imdbt += '📦BoxOffice  : ' + fids.data.BoxOffice + '\n';
        imdbt += '🏙️Production : ' + fids.data.Production + '\n';
        imdbt += '🌟imdbRating : ' + fids.data.imdbRating + '\n';
        imdbt += '❎imdbVotes  : ' + fids.data.imdbVotes + '';
        Void.sendMessage(
            citel.chat,
            {
                image: {
                    url: fids.data.Poster,
                },
                caption: imdbt,
            },
            {
                quoted: citel,
            },
        );
    },
);
