const { cmd, ui } = require('../lib');
const { exec } = require('child_process');
const fs = require('fs');
cmd(
    {
        pattern: 'blown',
        desc: 'adds blown in given audio',
        category: 'tools',
        use: '<reply to any audio>',
        react: '🌬',
    },
    async (Void, citel) => {
        let mime = citel.quoted.mtype;
        let set = '-af acrusher=.1:1:64:0:log';
        if (/audio/.test(mime)) {
            citel.reply(ui.text.wait);
            let media = await Void.downloadAndSaveMediaMessage(citel.quoted);
            let ran = citel.sender.slice(6) + '.mp3';
            exec(`ffmpeg -i ${media} ${set} ${ran}`, (err, stderr, stdout) => {
                fs.unlinkSync(media);
                if (err) return reply(err);
                let buff = fs.readFileSync(ran);
                Void.sendMessage(
                    citel.chat,
                    {
                        audio: buff,
                        mimetype: 'audio/mpeg',
                    },
                    {
                        quoted: citel,
                    },
                );
                fs.unlinkSync(ran);
            });
        } else citel.reply(`Reply to the audio you want to change with.*`);
    },
);
