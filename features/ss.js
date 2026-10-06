const { cmd, getBuffer } = require('../lib');
cmd(
    {
        pattern: 'ss',
        alias: ['webss', 'fullss'],
        category: 'search',
        desc: 'Provides screenshot of given url',
        use: '<text>',
        filename: __filename,
    },
    async (Void, citel, text) => {
        let limit = 5;
        try {
            if (!text) return citel.reply('```Uhh Please, Give me Url!```');
            let urll = `https://vihangayt.me/tools/ssweb?url=${text.match(/\bhttps?:\/\/\S+/gi)[0]}&width=1280&height=720`;
            let media = await getBuffer(urll);
            return await Void.sendMessage(
                citel.chat,
                {
                    image: media,
                },
                {
                    quoted: citel,
                },
            );
        } catch (err) {
            return citel.reply('```Error While Fetching Snapshot```');
        }
    },
);
