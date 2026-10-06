const { cmd, warndb, ui } = require('../lib');
cmd(
    {
        pattern: 'rwarn',
        desc: 'Deletes all previously given warns of quoted user.',
        category: 'group',
        filename: __filename,
        use: '<quote|reply|number>',
    },
    async (Void, citel, text, { isCreator }) => {
        if (!isCreator) return citel.reply(ui.text.owner);
        if (!citel.quoted) return citel.reply('Quote a user master.');
        await warndb.deleteOne({
            id: citel.quoted.sender.split('@')[0] + 'warn',
        });
        return citel.reply('User is now free as a bird.\n.');
    },
);
