const { cmd, getAdmin, prefix, ui } = require('../lib');
cmd(
    {
        pattern: 'tag',
        alias: ['hidetag'],
        desc: 'Tags everyperson of group without mentioning their numbers',
        category: 'group',
        filename: __filename,
        use: '<text>',
    },
    async (Void, citel, text, { isCreator }) => {
        if (!text && !citel.quoted) return citel.reply(`*Example : ${prefix}tag Hi Everyone, How are you Doing*`);
        if (!text) {
            text = citel.quoted.text;
        }
        if (!citel.isGroup) return citel.reply(ui.text.group);
        const groupMetadata = citel.isGroup ? await Void.groupMetadata(citel.chat).catch((e) => {}) : '';
        const participants = citel.isGroup ? await groupMetadata.participants : '';
        const groupAdmins = await getAdmin(Void, citel);
        const isAdmins = citel.isGroup ? groupAdmins.includes(citel.sender) : false;
        if (!isAdmins && !isCreator) return citel.reply(ui.text.admin);
        Void.sendMessage(
            citel.chat,
            {
                text: text,
                mentions: participants.map((a) => a.id),
            },
            {
                quoted: citel,
            },
        );
    },
);
