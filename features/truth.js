const { cmd } = require('../lib');
const { truth } = require('../lib/truth-dare.js');
cmd(
    {
        pattern: 'truth',
        desc: 'truth and dare(truth game.).',
        category: 'fun',
        filename: __filename,
    },
    async (Void, citel, text) => {
        return await citel.reply(`${truth()}`);
    },
);
