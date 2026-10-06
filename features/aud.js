const { cmd, prefix } = require('../lib');
const ytdl = require('ytdl-secktor');
const fs = require('fs-extra');
const { videotime, dlsize } = require('../lib/shared/songLimits');
cmd(
    {
        pattern: 'AUD',
        react: '🔊',
        alias: [],
        desc: 'Send YouTube link',
        category: 'downloader',
        filename: __filename,
        use: '<text>',
    },
    async (Void, citel, text) => {
        try {
            var msg = citel;
            if (!msg.quoted) return;
            if (!msg.quoted.isBaileys) return;
            if (!msg.quoted.caption) return console.log('ew');
            text = msg.quoted.caption;
            if (!text.includes('🎧 𝐗𝐋𝐈𝐂𝐎𝐍-𝐌𝐃 𝗦𝗢𝗡𝗚 𝗗𝗢𝗪𝗡𝗟𝗢𝗗𝗘𝗥🎧')) return;
            text = text.split('╏📡 *Url* : ')[1].split('\n')[0];
            if (!text) return;
            await Void.sendMessage(citel.chat, {
                react: {
                    text: '🎧',
                    key: msg.key,
                },
            });
            const getRandom = (ext) => {
                return `${Math.floor(Math.random() * 10000)}${ext}`;
            };
            if (text.length === 0) {
                citel.reply(`❌ URL is empty! \nSend ${prefix}ytmp3 url`);
                return;
            }
            let urlYt = text;
            if (!urlYt.startsWith('http')) {
                citel.reply(`❌ Give youtube link!`);
                return;
            }
            let infoYt = await ytdl.getInfo(urlYt);
            if (infoYt.videoDetails.lengthSeconds >= videotime) {
                citel.reply(`❌ I can't download that long video!`);
                return;
            }
            let titleYt = infoYt.videoDetails.title;
            let randomName = getRandom('.mp3');
            const stream = ytdl(urlYt, {
                filter: (info) => info.audioBitrate == 160 || info.audioBitrate == 128,
            }).pipe(fs.createWriteStream(`./${randomName}`));
            await new Promise((resolve, reject) => {
                stream.on('error', reject);
                stream.on('finish', resolve);
            });
            let stats = fs.statSync(`./${randomName}`);
            let fileSizeInBytes = stats.size;
            let fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
            if (fileSizeInMegabytes <= dlsize) {
                let yts = require('secktor-pack');
                let search = await yts(text);
                let buttonMessage = {
                    audio: fs.readFileSync(`./${randomName}`),
                    mimetype: 'audio/mpeg',
                    fileName: titleYt + '.mp3',
                    headerType: 4,
                };
                await Void.sendMessage(citel.chat, buttonMessage, {
                    quoted: citel,
                });
                return fs.unlinkSync(`./${randomName}`);
            }
        } catch (e) {
            citel.reply('' + e);
        }
    },
);
