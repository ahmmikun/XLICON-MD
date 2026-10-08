const { cmd, ui } = require('../lib');
const { getBuffer } = require('../lib/api');

cmd(
    {
        pattern: 'ss',
        alias: ['screenshot'],
        desc: 'Take a screenshot of a website',
        use: '<url>',
        category: 'tools',
        filename: __filename,
    },
    async (Void, citel, text) => {
        const url = text.trim();
        if (!/^https?:\/\//i.test(url)) return citel.reply(ui.info(`Send a full link, e.g. ${ui.prefix}ss https://example.com`));
        const image = await getBuffer(`https://image.thum.io/get/width/1280/crop/720/${url}`, { timeout: 40000 });
        return Void.sendMessage(citel.chat, { image }, { quoted: citel });
    },
);
