const { cmd, GIFBufferToVideoBuffer } = require('../lib');
const { fetchJson } = require('../lib/');
const axios = require('axios');
cmd(
    {
        pattern: 'poke',
        category: 'reaction',
        use: '<quote|reply|tag>',
    },
    async (conn, message) => {
        const apiResponse = await fetchJson('https://api.waifu.pics/sfw/poke');
        const imageResponse = await axios.get(apiResponse.url, {
            responseType: 'arraybuffer',
        });
        const gifBuffer = Buffer.from(imageResponse.data, 'utf-8');
        const targetUser = message.mentionedJid
            ? message.mentionedJid[0]
            : message.msg.contextInfo.participant || false;
        const videoBuffer = await GIFBufferToVideoBuffer(gifBuffer);
        if (targetUser) {
            const caption = '@' + message.sender.split('@')[0] + ' poked to @' + targetUser.split('@')[0] + ' ';
            conn.sendMessage(
                message.chat,
                {
                    video: videoBuffer,
                    gifPlayback: true,
                    mentions: [targetUser, message.sender],
                    caption: caption,
                },
                {
                    quoted: message,
                },
            );
        } else {
            const caption = '@' + message.sender.split('@')[0] + ' poked to everyone. ';
            conn.sendMessage(
                message.chat,
                {
                    video: videoBuffer,
                    gifPlayback: true,
                    mentions: [message.sender],
                    caption: caption,
                },
                {
                    quoted: message,
                },
            );
        }
    },
);
