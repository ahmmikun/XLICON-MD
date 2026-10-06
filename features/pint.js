const { cmd, pinterest, Config, ui } = require('../lib');
cmd(
    {
        pattern: 'pint',
        desc: 'Downloads image from pinterest.',
        category: 'downloader',
        filename: __filename,
        use: '<text|image name>',
    },
    async (Void, citel, text) => {
        if (!text)
            return (
                reply('What picture are you looking for?') &&
                Void.sendMessage(citel.chat, {
                    react: {
                        text: '❌',
                        key: citel.key,
                    },
                })
            );
        try {
            anu = await pinterest(text);
            result = anu[Math.floor(Math.random() * anu.length)];
            let buttonMessage = {
                image: {
                    url: result,
                },
                caption: ` `,
                footer: ui.text.footer,
                headerType: 4,
                contextInfo: {
                    externalAdReply: {
                        title: `Here you go✨`,
                        body: `${Config.owner.name}`,
                        thumbnail: log0,
                        mediaType: 2,
                        mediaUrl: ``,
                        sourceUrl: ``,
                    },
                },
            };
            return Void.sendMessage(citel.chat, buttonMessage, {
                quoted: citel,
            });
        } catch (e) {
            console.log(e);
        }
    },
);
