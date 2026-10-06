const { cmd } = require('../lib');
const googleTTS = require('google-tts-api');
cmd(
    {
        pattern: 'tts',
        desc: 'text to speech.',
        category: 'downloader',
        filename: __filename,
        use: '<Hii,this is Star>',
    },
    async (Void, citel, text) => {
        if (!text) return citel.reply('Please give me a Sentence to change into audio.');
        let texttts = text;
        const ttsurl = googleTTS.getAudioUrl(texttts, {
            lang: 'en',
            slow: false,
            host: 'https://translate.google.com',
        });
        return Void.sendMessage(
            citel.chat,
            {
                audio: {
                    url: ttsurl,
                },
                mimetype: 'audio/mpeg',
                fileName: `ttsCitelVoid.m4a`,
            },
            {
                quoted: citel,
            },
        );
    },
);
