const { cmd } = require('../lib');
cmd(
    {
        pattern: 'readmore',
        desc: 'Adds *readmore* in given text.',
        category: 'misc',
        filename: __filename,
    },
    async (Void, citel, text) => {
        return await citel.reply(text.replace(/\+/g, String.fromCharCode(8206).repeat(4001)));
    },
);
