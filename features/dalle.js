const { cmd, ui } = require('../lib');
const ai = require('../lib/ai');

cmd(
    {
        pattern: 'dalle',
        alias: ['imagine'],
        desc: 'Create an image from a text prompt',
        use: '<prompt>',
        category: 'ai',
        filename: __filename,
    },
    async (Void, citel, text) => {
        if (!text) return citel.reply(ui.info(`Describe the image, e.g. ${ui.prefix}dalle a dragon over Lagos`));
        const image = await ai.image(text);
        return Void.sendMessage(citel.chat, { image, caption: ui.font(text) }, { quoted: citel });
    },
);
