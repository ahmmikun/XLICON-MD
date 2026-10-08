const { cmd, ui } = require('../lib');
const ai = require('../lib/ai');

cmd(
    {
        pattern: 'chatgpt',
        desc: 'Ask the AI a question',
        use: '<question>',
        category: 'ai',
        filename: __filename,
    },
    async (Void, citel, text) => {
        if (!text) return citel.reply(ui.info(`Ask me something, e.g. ${ui.prefix}chatgpt write a short poem`));
        return citel.reply(await ai.ask(text));
    },
);
