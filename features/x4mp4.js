const { cmd } = require('../lib');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs-extra');
const { getTempFilePath, safeUnlink } = require('../lib/shared/tempFiles');
cmd(
    {
        pattern: 'x4mp4',
        category: 'misc',
        desc: 'Reduces video size/dimensions by 75%.',
        filename: __filename,
    },
    async (Void, citel) => {
        if (!citel.quoted) return citel.reply('*Please quote a video.*');
        if (!/video/.test(citel.quoted.mtype)) return citel.reply('*Need a video message.*');
        await citel.reply('Compressing video by 75%, please wait...');
        let media = null;
        let outputPath = getTempFilePath('mp4');
        try {
            media = await Void.downloadAndSaveMediaMessage(citel.quoted);
            ffmpeg(media)
                .withSize('25%')
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
                        citel.reply('Error sending compressed video: ' + err.message);
                    } finally {
                        safeUnlink(outputPath);
                        safeUnlink(media);
                    }
                })
                .on('error', (err) => {
                    safeUnlink(outputPath);
                    safeUnlink(media);
                    citel.reply('Error resizing video: ' + err.message);
                });
        } catch (e) {
            safeUnlink(outputPath);
            safeUnlink(media);
            return citel.reply('Failed to resize video: ' + e.message);
        }
    },
);
