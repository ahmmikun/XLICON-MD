const { plugins, cmd, ui } = require('../lib');
cmd(
    {
        pattern: 'plugins',
        alias: ['plugin'],
        category: 'owner',
        desc: 'Shows list of all externally installed modules',
        filename: __filename,
    },
    async (Void, citel, text, { isCreator }) => {
        if (!isCreator) return citel.reply(ui.text.owner);
        let allmodtext = `*All Installed Modules are:-*\n\n`;
        allmodtext += await plugins();
        return await citel.reply(allmodtext);
    },
);
