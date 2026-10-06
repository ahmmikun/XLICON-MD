const { cmd, ui } = require('../lib');
cmd(
    {
        pattern: 'join',
        desc: 'joins group by link',
        category: 'owner',
        use: '<group link.>',
    },
    async (Void, citel, text, { isCreator }) => {
        if (!isCreator) return citel.reply(ui.text.owner);
        if (!text) return citel.reply(`Please give me Query ${ui.text.greet}`);
        if (!text.split(' ')[0] && !text.split(' ')[0].includes('whatsapp.com'))
            citel.reply('Link Invalid, Please Send a valid whatsapp Group Link!');
        let result = text.split(' ')[0].split('https://chat.whatsapp.com/')[1];
        await Void.groupAcceptInvite(result)
            .then((res) => citel.reply('🟩Joined Group'))
            .catch((err) => citel.reply('Error in Joining Group'));
    },
);
