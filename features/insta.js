const { cmd } = require('../lib');
cmd(
    {
        pattern: 'insta',
        desc: 'Download Instagram post.',
        category: 'downloader',
        filename: __filename,
    },
    async (conn, message, query, { isCreator }) => {
        const { Insta } = require('../lib');
        if (!query) {
            return message.reply('Need post url.');
        }
        const mediaUrls = await Insta(query);
        for (let i = 0; i < mediaUrls.length; i++) {
            await conn.sendFileUrl(message.chat, mediaUrls[i], '*Downloaded Media from instagram.*', message);
        }
    },
);
