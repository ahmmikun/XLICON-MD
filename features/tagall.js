const { cmd, Config, getAdmin, ui } = require('../lib');
cmd(
    {
        pattern: 'tagall',
        desc: 'Tags every person of group.',
        category: 'group',
        filename: __filename,
    },
    async (Void, citel, text, { isCreator }) => {
        if (!citel.isGroup) return citel.reply(ui.text.group);
        const groupMetadata = citel.isGroup ? await Void.groupMetadata(citel.chat).catch((e) => {}) : '';
        const participants = citel.isGroup ? await groupMetadata.participants : '';
        const groupAdmins = await getAdmin(Void, citel);
        const isAdmins = citel.isGroup ? groupAdmins.includes(citel.sender) : false;
        if (!isAdmins) return citel.reply(ui.text.admin);
        let textt = `
══✪〘   *Tag All*   〙✪══

➲ *Message :* ${text ? text : 'blank'}\n\n
➲ *Author:* ${Config.owner.name} 🔖
`;
        for (let mem of participants) {
            textt += `📍 @${mem.id.split('@')[0]}\n`;
        }
        Void.sendMessage(
            citel.chat,
            {
                text: textt,
                mentions: participants.map((a) => a.id),
            },
            {
                quoted: citel,
            },
        );
    },
);
