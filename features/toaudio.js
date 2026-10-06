const { cmd } = require('../lib/');
const fs = require('fs-extra');
cmd(
    {
        pattern: 'toaudio',
        alias: ['mp3', 'tomp3'],
        desc: 'changes type to audio.',
        category: 'converter',
        use: '<reply to any Video>',
        filename: __filename,
    },
    async (Void, citel, text) => {
        if (!citel.quoted) return citel.reply(`_Reply to Any Video_`);
        let mime = citel.quoted.mtype;
        if (mime == 'audioMessage' || mime == 'videoMessage') {
            let media = await Void.downloadAndSaveMediaMessage(citel.quoted);
            const { toAudio } = require('../lib');
            let buffer = fs.readFileSync(media);
            let audio = await toAudio(buffer);
            Void.sendMessage(
                citel.chat,
                {
                    audio: audio,
                    mimetype: 'audio/mpeg',
                },
                {
                    quoted: citel,
                },
            );
            fs.unlink(media, (err) => {
                if (err) {
                    return console.error('File Not Deleted from From TOAUDIO AT : ', media, '\n while Error : ', err);
                } else return console.log('File deleted successfully in TOAUDIO MP3 at : ', media);
            });
        } else return citel.reply('` Please, Reply To A video Message```');
    },
);
