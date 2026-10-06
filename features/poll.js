const { cmd, prefix, ui } = require('../lib');
cmd(
    {
        pattern: 'poll',
        desc: 'Makes poll in group.',
        category: 'group',
        filename: __filename,
        use: `question;option1,option2,option3.....`,
    },
    async (Void, citel, text, { isCreator }) => {
        if (!isCreator) return citel.reply(ui.text.owner);
        let [poll, opt] = text.split(';');
        if (text.split(';') < 2) return await citel.reply(`${prefix}poll question;option1,option2,option3.....`);
        let options = [];
        for (let i of opt.split(',')) {
            options.push(i);
        }
        await Void.sendMessage(citel.chat, {
            poll: {
                name: poll,
                values: options,
            },
        });
    },
);
