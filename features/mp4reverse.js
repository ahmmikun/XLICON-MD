const { cmd } = require('../lib');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs-extra');
const { getTempFilePath, safeUnlink } = require('../lib/shared/tempFiles');
cmd(
    {
        pattern: 'mp4reverse',
        alias: ['reversevideo', 'videoreverse'],
        category: 'misc',
        desc: 'Plays the video and audio in reverse.',
        filename: __filename,
    },
    async (Void, citel) => {
        if (!citel.quoted) return citel.reply('*Please quote a video.*');
        if (!/video/.test(citel.quoted.mtype)) return citel.reply('*Need a video message.*');
        await citel.reply('Reversing video, please wait...');
        let media = null;
        let outputPath = getTempFilePath('mp4');
        try {
            media = await Void.downloadAndSaveMediaMessage(citel.quoted);
            ffmpeg(media)
                .outputOptions(['-y', '-vf', 'reverse', '-af', 'areverse'])
                .format('mp4')
                .fps(22)
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
                        citel.reply('Error sending reversed video: ' + err.message);
                    } finally {
                        safeUnlink(outputPath);
                        safeUnlink(media);
                    }
                })
                .on('error', (err) => {
                    safeUnlink(outputPath);
                    safeUnlink(media);
                    citel.reply('Error reversing video: ' + err.message);
                });
        } catch (e) {
            safeUnlink(outputPath);
            safeUnlink(media);
            return citel.reply('Failed to reverse video: ' + e.message);
        }
    },
);
