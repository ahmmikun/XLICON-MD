const { ringtone, cmd, prefix } = require('../lib');
cmd(
    {
        pattern: 'ringtone',
        desc: 'Downloads ringtone.',
        category: 'downloader',
        filename: __filename,
        use: '<ringtone name>',
    },
    async (Void, citel, text) => {
        if (!text) return citel.reply(`Example: ${prefix}ringtone back in black`);
        let anu = await ringtone(text);
        let result = anu[Math.floor(Math.random() * anu.length)];
        return Void.sendMessage(
            citel.chat,
            {
                audio: {
                    url: result.audio,
                },
                fileName: result.title + '.mp3',
                mimetype: 'audio/mpeg',
            },
            {
                quoted: citel,
            },
        );
    },
);
