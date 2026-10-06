const { fetchJson, cmd } = require('../lib');
cmd(
    {
        pattern: 'couplepp',
        category: 'search',
        desc: 'Sends two couples pics.',
        filename: __filename,
    },
    async (Void, citel, text) => {
        let anu = await fetchJson('https://raw.githubusercontent.com/iamriz7/kopel_/main/kopel.json');
        let random = anu[Math.floor(Math.random() * anu.length)];
        Void.sendMessage(
            citel.chat,
            {
                image: {
                    url: random.male,
                },
                caption: `🦄xʟɪᴄᴏɴ ɪᴍᴀɢᴇ ᴅᴏᴡɴʟᴏᴅᴇʀ`,
            },
            {
                quoted: citel,
            },
        );
        Void.sendMessage(
            citel.chat,
            {
                image: {
                    url: random.female,
                },
                caption: `🦄xʟɪᴄᴏɴ ɪᴍᴀɢᴇ ᴅᴏᴡɴʟᴏᴅᴇʀ`,
            },
            {
                quoted: citel,
            },
        );
    },
);
