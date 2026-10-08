const { cmd, ui } = require('../lib');
const ai = require('../lib/ai');

cmd(
    {
        pattern: 'chat',
        alias: ['gpt', 'ai'],
        desc: 'Chat with the AI',
        use: '<question>',
        category: 'ai',
        filename: __filename,
    },
    async (Void, citel, text) => {
        if (!text) return citel.reply(ui.info(`Ask me something, e.g. ${ui.prefix}chat what is a black hole?`));
        return citel.reply(await ai.ask(text));
    },
);
