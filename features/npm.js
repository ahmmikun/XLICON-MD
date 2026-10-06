const { cmd } = require('../lib');
const axios = require('axios');
cmd(
    {
        pattern: 'npm',
        desc: 'search  npm packages from their name .',
        category: 'search',
        use: '<package name>',
        filename: __filename,
    },
    async (Void, citel, text) => {
        if (!text) return citel.reply('Please give me package name.📦');
        axios
            .get(`https://api.npms.io/v2/search?q=${text}`)
            .then(({ data }) => {
                let txt = data.results
                    .map(
                        ({ package: pkg }) =>
                            `*${pkg.name}* (v${pkg.version})\n_${pkg.links.npm}_\n_${pkg.description}_`,
                    )
                    .join('\n\n');
                citel.reply(txt);
            })
            .catch((e) => console.log(e));
    },
);
