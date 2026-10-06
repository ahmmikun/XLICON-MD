const { cmd, getBuffer } = require('../lib');
const ytdl = require('ytdl-secktor');
const fs = require('fs-extra');
const { videotime, dlsize } = require('../lib/shared/downloadLimits');
cmd(
    {
        pattern: 'play',
        alias: ['song'],
        desc: 'Downloads audio from youtube.',
        category: 'downloader',
        filename: __filename,
        use: '<text>',
    },
    async (Void, citel, text) => {
        let yts = require('secktor-pack');
        let search = await yts(text);
        let anu = search.videos[0];
        const getRandom = (ext) => {
            return `${Math.floor(Math.random() * 10000)}${ext}`;
        };
        let infoYt = await ytdl.getInfo(anu.url);
        if (infoYt.videoDetails.lengthSeconds >= videotime) return citel.reply(`😔 Video file too big!`);
        let titleYt = infoYt.videoDetails.title;
        let randomName = getRandom('.mp3');
        citel.reply('*Downloading:* ' + titleYt);
        const stream = ytdl(anu.url, {
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
            let buttonMessage = {
                audio: fs.readFileSync(`./${randomName}`),
                mimetype: 'audio/mpeg',
                fileName: titleYt + '.mp3',
                headerType: 4,
                contextInfo: {
                    externalAdReply: {
                        title: titleYt,
                        body: citel.pushName,
                        renderLargerThumbnail: true,
                        thumbnailUrl: search.all[0].thumbnail,
                        mediaUrl: text,
                        mediaType: 1,
                        thumbnail: await getBuffer(search.all[0].thumbnail),
                        sourceUrl: text,
                    },
                },
            };
            await Void.sendMessage(citel.chat, buttonMessage, {
                quoted: citel,
            });
            return fs.unlinkSync(`./${randomName}`);
        } else {
            citel.reply(`❌ File size bigger than 100mb.`);
        }
        fs.unlinkSync(`./${randomName}`);
    },
);
