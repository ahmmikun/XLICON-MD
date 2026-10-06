const { sck, cmd, ui } = require('../lib');
cmd(
    {
        pattern: 'setgoodbye',
        desc: 'sets goodbye message in specific group.',
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
                goodbye: text,
                events: 'true',
            }).save();
            return citel.reply('Goodbye added for this group.');
        } else {
            await await sck.updateOne(
                {
                    id: citel.chat,
                },
                {
                    goodbye: text,
                    events: 'true',
                },
            );
            return citel.reply('Goodbye msg has been updated successfully.');
        }
    },
);
