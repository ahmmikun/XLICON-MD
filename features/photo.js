const { cmd, ui } = require('../lib');
const { execFile } = require('child_process');
const fs = require('fs-extra');
const { getTempFilePath, safeUnlink } = require('../lib/shared/tempFiles');

cmd(
    {
        pattern: 'photo',
        desc: 'Makes photo of replied sticker.',
        category: 'converter',
        use: '<reply to any gif>',
        filename: __filename,
    },
    async (Void, citel, text) => {
        if (!citel.quoted) return citel.reply('_Reply to Any Sticker._');
        const mime = citel.quoted.mtype;
        if (mime !== 'imageMessage' && mime !== 'stickerMessage') {
            return citel.reply('```Uhh Please, Reply To A Non Animated Sticker```');
        }

        const media = await Void.downloadAndSaveMediaMessage(citel.quoted);
        const output = getTempFilePath('png');

        execFile('ffmpeg', ['-y', '-i', media, output], async (error) => {
            try {
                if (error) return await citel.reply(ui.fail(`ffmpeg failed: ${error.message}`));
                const buffer = await fs.promises.readFile(output);
                await Void.sendMessage(
                    citel.chat,
                    {
                        image: buffer,
                    },
                    {
                        quoted: citel,
                    },
                );
            } catch (err) {
                await citel.reply(ui.fail(`Could not convert the sticker: ${err.message}`));
            } finally {
                safeUnlink(media);
                safeUnlink(output);
            }
        });
    },
);
