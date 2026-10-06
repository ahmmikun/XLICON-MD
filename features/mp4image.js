const { cmd } = require('../lib');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs-extra');
const { getTempFilePath, safeUnlink } = require('../lib/shared/tempFiles');
cmd(
    {
        pattern: 'mp4image',
        category: 'misc',
        desc: 'Converts a photo to a 5-second video.',
        filename: __filename,
    },
    async (Void, citel) => {
        if (!citel.quoted) return citel.reply('*Please quote an image.*');
        if (!/image/.test(citel.quoted.mtype)) return citel.reply('*Need an image message.*');
        await citel.reply('Converting photo to video, please wait...');
        let media = null;
        let outputPath = getTempFilePath('mp4');
        try {
            media = await Void.downloadAndSaveMediaMessage(citel.quoted);
            ffmpeg(media)
                .loop(5)
                .fps(19)
                .videoBitrate(400)
                .format('mp4')
                .save(outputPath)
                .on('end', async () => {
                    try {
                        await Void.sendMessage(
                            citel.chat,
                            {
                                video: fs.readFileSync(outputPath),
                            },
                            {
                                quoted: citel,
                            },
                        );
                    } catch (err) {
                        citel.reply('Error sending video: ' + err.message);
                    } finally {
                        safeUnlink(outputPath);
                        safeUnlink(media);
                    }
                })
                .on('error', (err) => {
                    safeUnlink(outputPath);
                    safeUnlink(media);
                    citel.reply('Error converting image to video: ' + err.message);
                });
        } catch (e) {
            safeUnlink(outputPath);
            safeUnlink(media);
            return citel.reply('Failed to convert image: ' + e.message);
        }
    },
);
