const { cmd } = require('../lib');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs-extra');
const { getTempFilePath, safeUnlink } = require('../lib/shared/tempFiles');
cmd(
    {
        pattern: 'mp3crusher',
        category: 'misc',
        desc: 'Distorts and bitcrushes audio for a comical sound effect.',
        filename: __filename,
    },
    async (Void, citel) => {
        if (!citel.quoted) return citel.reply('*Please quote an audio or video message.*');
        if (!/video|audio/.test(citel.quoted.mtype)) return citel.reply('*Need an audio or video message.*');
        await citel.reply('Distorting audio, please wait...');
        let media = null;
        let outputPath = getTempFilePath('mp3');
        try {
            media = await Void.downloadAndSaveMediaMessage(citel.quoted);
            ffmpeg(media)
                .outputOptions(['-y', '-filter_complex', 'acrusher=level_in=8:level_out=18:bits=8:mode=log:aa=1'])
                .format('mp3')
                .save(outputPath)
                .on('end', async () => {
                    try {
                        await Void.sendMessage(
                            citel.chat,
                            {
                                audio: fs.readFileSync(outputPath),
                                mimetype: 'audio/mpeg',
                            },
                            {
                                quoted: citel,
                            },
                        );
                    } catch (err) {
                        citel.reply('Error sending crushed audio: ' + err.message);
                    } finally {
                        safeUnlink(outputPath);
                        safeUnlink(media);
                    }
                })
                .on('error', (err) => {
                    safeUnlink(outputPath);
                    safeUnlink(media);
                    citel.reply('Error processing audio: ' + err.message);
                });
        } catch (e) {
            safeUnlink(outputPath);
            safeUnlink(media);
            return citel.reply('Failed to process audio: ' + e.message);
        }
    },
);
