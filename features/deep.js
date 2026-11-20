const { cmd, ui } = require('../lib');
const { execFile } = require('child_process');
const fs = require('fs');
const { getTempFilePath, safeUnlink } = require('../lib/shared/tempFiles');

cmd(
    {
        pattern: 'deep',
        desc: 'adds deep effect in given audio',
        category: 'tools',
        use: '<reply to any audio>',
        react: '🌀',
    },
    async (Void, citel) => {
        if (!citel.quoted) return citel.reply(ui.info('Reply to an audio message.'));
        if (!/audio/.test(citel.quoted.mtype)) {
            return citel.reply('Reply to the audio you want to change with.');
        }

        citel.reply(ui.text.wait);
        const media = await Void.downloadAndSaveMediaMessage(citel.quoted);
        const output = getTempFilePath('mp3');

        execFile(
            'ffmpeg',
            ['-y', '-i', media, '-af', 'atempo=4/4,asetrate=44500*2/3', output],
            async (error) => {
                try {
                    if (error) return await citel.reply(ui.fail(`ffmpeg failed: ${error.message}`));
                    const buffer = await fs.promises.readFile(output);
                    await Void.sendMessage(
                        citel.chat,
                        {
                            audio: buffer,
                            mimetype: 'audio/mpeg',
                        },
                        {
                            quoted: citel,
                        },
                    );
                } catch (err) {
                    await citel.reply(ui.fail(`Could not process the audio: ${err.message}`));
                } finally {
                    safeUnlink(media);
                    safeUnlink(output);
                }
            },
        );
    },
);
