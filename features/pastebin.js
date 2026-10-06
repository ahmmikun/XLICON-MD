const { cmd, Config, ui } = require('../lib');
const PastebinAPI = require('../lib/pastebin');

cmd(
    {
        pattern: 'pastebin',
        desc: 'Upload the quoted text to Pastebin',
        category: 'extra',
        filename: __filename,
    },
    async (Void, citel) => {
        if (!Config.pastebinKey) return citel.reply(ui.warn('Set PASTEBIN_KEY in config.env to use this command.'));
        if (!citel.quoted) return citel.reply(ui.info('Quote any text to get a link.'));
        const link = await new PastebinAPI(Config.pastebinKey).createPaste(citel.quoted.text, 'XLICON-Pastebin');
        return citel.reply(ui.ok(`Here is your link:\n${link}`));
    },
);
