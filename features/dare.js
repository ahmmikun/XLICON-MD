const { cmd } = require('../lib');
const { dare } = require('../lib/truth-dare.js');
cmd(
    {
        pattern: 'dare',
        desc: 'truth and dare(dare game.).',
        category: 'fun',
        filename: __filename,
    },
    async (Void, citel, text) => {
        return await citel.reply(`${dare()}`);
    },
);
