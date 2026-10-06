const { cmd } = require('../lib');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs-extra');
const { getTempFilePath, safeUnlink } = require('../lib/shared/tempFiles');
cmd(
    {
        pattern: 'spectrum',
        category: 'misc',
        desc: 'Converts sound/video into an audio spectrum visualizer video.',
        filename: __filename,
    },
    async (Void, citel) => {
        if (!citel.quoted) return citel.reply('*Please quote an audio or video message.*');
        if (!/video|audio/.test(citel.quoted.mtype)) return citel.reply('*Need an audio or video message.*');
        await citel.reply('Generating spectrum visualizer, please wait...');
        let media = null;
        let outputPath = getTempFilePath('mp4');
        try {
            media = await Void.downloadAndSaveMediaMessage(citel.quoted);
            ffmpeg(media)
                .outputOptions([
                    '-y',
                    '-filter_complex',
                    '[0:a]showspectrum=s=720x1280,format=yuv420p[v]',
                    '-map',
                    '[v]',
                    '-map 0:a',
                ])
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
                        citel.reply('Error sending spectrum video: ' + err.message);
                    } finally {
                        safeUnlink(outputPath);
                        safeUnlink(media);
                    }
                })
                .on('error', (err) => {
                    safeUnlink(outputPath);
                    safeUnlink(media);
                    citel.reply('Error generating spectrum: ' + err.message);
                });
        } catch (e) {
            safeUnlink(outputPath);
            safeUnlink(media);
            return citel.reply('Failed to process spectrum: ' + e.message);
        }
    },
);
