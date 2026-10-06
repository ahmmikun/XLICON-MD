const { cmd, Config, ui } = require('../lib');

cmd(
    {
        pattern: 'owner',
        alias: ['intro'],
        desc: 'Show the owner contact',
        category: 'general',
        filename: __filename,
    },
    async (Void, citel) => {
        const name = Config.owner.name;
        const number = Config.owner.number || (await Void.decodeJid(Void.user.id)).split('@')[0];
        const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nORG:;\nTEL;type=CELL;type=VOICE;waid=${number}:+${number}\nEND:VCARD`;
        await Void.sendMessage(citel.chat, { contacts: { displayName: name, contacts: [{ vcard }] } }, { quoted: citel });
        return citel.reply(
            ui.panel('OWNER', '👑', [
                ui.field('👤', 'Name', name),
                ui.field('💬', 'Chat', `wa.me/${number}`),
                ui.field('📦', 'Source', Config.github),
            ]),
        );
    },
);
