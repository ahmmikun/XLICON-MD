const { cmd, getBuffer } = require('../lib');
const ytdl = require('ytdl-secktor');
const fs = require('fs-extra');
const { videotime, dlsize } = require('../lib/shared/downloadLimits');
cmd(
    {
        pattern: 'video',
        desc: 'Downloads video from yt.',
        category: 'downloader',
        filename: __filename,
        use: '<808-juice wrld >',
    },
    async (Void, citel, text) => {
        let yts = require('secktor-pack');
        let search = await yts(text);
        let anu = search.videos[0];
        let urlYt = anu.url;
        const getRandom = (ext) => {
            return `${Math.floor(Math.random() * 10000)}${ext}`;
        };
        let infoYt = await ytdl.getInfo(urlYt);
        if (infoYt.videoDetails.lengthSeconds >= videotime) return citel.reply(`😔 Video file too big!`);
        let titleYt = infoYt.videoDetails.title;
        let randomName = getRandom('.mp4');
        citel.reply('*Downloading:* ' + titleYt);
        const stream = ytdl(urlYt, {
            filter: (info) => info.itag == 22 || info.itag == 18,
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
                video: fs.readFileSync(`./${randomName}`),
                jpegThumbnail: log0,
                mimetype: 'video/mp4',
                fileName: `${titleYt}.mp4`,
                caption: ` ⿻ Title : ${titleYt}\n ⿻ File Size : ${fileSizeInMegabytes} MB`,
                headerType: 4,
                contextInfo: {
                    externalAdReply: {
                        title: titleYt,
                        body: citel.pushName,
                        thumbnail: await getBuffer(search.all[0].thumbnail),
                        renderLargerThumbnail: true,
                        mediaType: 2,
                        mediaUrl: search.all[0].thumbnail,
                        sourceUrl: search.all[0].thumbnail,
                    },
                },
            };
            Void.sendMessage(citel.chat, buttonMessage, {
                quoted: citel,
            });
            return fs.unlinkSync(`./${randomName}`);
        } else {
            citel.reply(`😔 File size bigger than 100mb.`);
        }
        return fs.unlinkSync(`./${randomName}`);
    },
);
