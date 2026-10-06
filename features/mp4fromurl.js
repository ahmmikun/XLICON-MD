const { cmd, ui } = require('../lib');
cmd(
    {
        pattern: 'mp4fromurl',
        desc: 'download mp4 from url.',
        category: 'misc',
        use: '<url>',
        filename: __filename,
    },
    async (Void, citel, text) => {
        if (!text) return citel.reply(`Where's the link ?`);
        Void.sendMessage(
            citel.chat,
            {
                video: {
                    url: text.split(' ')[0],
                },
                caption: '*HERE WE GO*',
                contextInfo: {
                    externalAdReply: {
                        title: ui.text.title,
                        body: `${citel.pushName}`,
                        thumbnail: log0,
                        mediaType: 2,
                        mediaUrl: ``,
                        sourceUrl: ``,
                    },
                },
            },
            {
                quoted: citel,
            },
        );
    },
);
