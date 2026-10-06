const { sck, cmd, ui } = require('../lib');
cmd(
    {
        pattern: 'setwelcome',
        desc: 'sets welcome message in specific group.',
        category: 'misc',
    },
    async (Void, citel, text, { isCreator }) => {
        if (!isCreator) return citel.reply(ui.text.owner);
        let Group = await sck.findOne({
            id: citel.chat,
        });
        if (!Group) {
            await new sck({
                id: citel.chat,
                welcome: text,
                events: 'true',
            }).save();
            return citel.reply('Welcome added added for this group.');
        } else {
            await await sck.updateOne(
                {
                    id: citel.chat,
                },
                {
                    welcome: text,
                    events: 'true',
                },
            );
            return citel.reply('Welcome msg has been updated successfully.');
        }
    },
);
