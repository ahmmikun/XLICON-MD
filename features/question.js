const { cmd } = require('../lib');
const { random_question } = require('../lib/truth-dare.js');
cmd(
    {
        pattern: 'question',
        desc: 'Random Question.',
        category: 'fun',
        filename: __filename,
    },
    async (Void, citel, text) => {
        return await citel.reply(`${random_question()}`);
    },
);
