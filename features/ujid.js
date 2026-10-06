const { cmd, ui } = require('../lib');
cmd(
    {
        pattern: 'ujid',
        desc: 'get jid of all user in a group.',
        category: 'owner',
        filename: __filename,
    },
    async (Void, citel, text, { isCreator }) => {
        if (!isCreator) return citel.reply(ui.text.owner);
        const groupMetadata = citel.isGroup ? await Void.groupMetadata(citel.chat).catch((e) => {}) : '';
        const participants = citel.isGroup ? await groupMetadata.participants : '';
        let textt = `_Here is jid address of all users of_\n *- ${groupMetadata.subject}*\n\n`;
        for (let mem of participants) {
            textt += `📍 ${mem.id}\n`;
        }
        citel.reply(textt);
    },
);
