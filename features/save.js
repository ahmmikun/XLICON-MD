const { cmd } = require('../lib');
cmd(
    {
        pattern: 'save',
        desc: 'Save status.',
        category: 'misc',
    },
    async (Void, citel, text) => {
        if (!citel.quoted || !citel.quoted.hasMedia) return;
        try {
            const statusObj = await Void.getStatus(citel.chat);
            if (!statusObj) {
                return citel.reply('No status available to save.');
            }
            if (statusObj.mediaMessage.imageMessage) {
                const caption = statusObj.mediaMessage.imageMessage.caption;
                const mediaUrl = await Void.downloadMediaMessage(statusObj.mediaMessage);
                return citel.reply(`Status saved!`, {
                    image: {
                        url: mediaUrl,
                    },
                    caption,
                });
            } else if (statusObj.mediaMessage.videoMessage) {
                const caption = statusObj.mediaMessage.videoMessage.caption;
                const mediaUrl = await Void.downloadMediaMessage(statusObj.mediaMessage);
                return citel.reply(`Status saved!`, {
                    video: {
                        url: mediaUrl,
                    },
                    caption,
                });
            } else {
                return citel.reply('Unsupported status type.');
            }
        } catch (error) {
            console.error(error);
            citel.reply('Error saving status.');
        }
    },
);
