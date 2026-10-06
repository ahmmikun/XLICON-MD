const { cmd, getBuffer } = require('../lib');
const ytdl = require('ytdl-secktor');
const fs = require('fs-extra');
const { videotime, dlsize } = require('../lib/shared/downloadLimits');
cmd(
    {
        pattern: 'ytmp4',
        desc: 'Downloads video from youtube.',
        category: 'downloader',
        filename: __filename,
        use: '<yt video url>',
    },
    async (Void, citel, text) => {
        const getRandom = (ext) => {
            return `${Math.floor(Math.random() * 10000)}${ext}`;
        };
        if (!text) {
            citel.reply(`❌Please provide me a url`);
            return;
        }
        try {
            let urlYt = text;
            if (!urlYt.startsWith('http')) return citel.reply(`❌ Give youtube link!`);
            let infoYt = await ytdl.getInfo(urlYt);
            if (infoYt.videoDetails.lengthSeconds >= videotime) return citel.reply(`❌ Video file too big!`);
            let titleYt = infoYt.videoDetails.title;
            let randomName = getRandom('.mp4');
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
                let yts = require('secktor-pack');
                let search = await yts(text);
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
                citel.reply(`❌ File size bigger than 100mb.`);
            }
            return fs.unlinkSync(`./${randomName}`);
        } catch (e) {
            console.log(e);
        }
    },
);
