const { cmd } = require('../lib');
const axios = require('axios');
cmd(
    {
        pattern: 'quotes',
        desc: 'Sends quotes in chat.',
        category: 'fun',
        filename: __filename,
    },
    async (Void, citel, text) => {
        var quoo = await axios.get(`https://favqs.com/api/qotd`);
        const replyf = `
✻ ═════ •❅• ═════ ✼
║ *🗂Content:* ${quoo.data.quote.body}
║ *👤Author:* ${quoo.data.quote.author}
║ * 👨‍💻𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐑:-𝐄𝐗𝐂𝐄𝐋
✻ ═════ •❅• ═════ ✼ `;
        return citel.reply(replyf);
    },
);
