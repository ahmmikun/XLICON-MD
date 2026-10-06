const { cmd, ui } = require('../lib');

const verdict = (percent) => {
    if (percent < 25) return "There's still time to reconsider your choices.";
    if (percent < 50) return 'Good enough, I guess! 💫';
    if (percent < 75) return "Stay together and you'll find a way ⭐️";
    if (percent < 90) return 'Amazing! You two will be a good couple 💖';
    return 'You two are fated to be together 💙';
};

cmd(
    {
        pattern: 'ship',
        desc: 'Match two members of the group',
        category: 'fun',
        filename: __filename,
    },
    async (Void, citel) => {
        if (!citel.isGroup) return citel.reply(ui.text.group);
        const meta = await Void.groupMetadata(citel.chat).catch(() => null);
        const members = meta ? meta.participants.map((member) => member.id) : [];
        const partner =
            (citel.mentionedJid && citel.mentionedJid[0]) ||
            (citel.msg && citel.msg.contextInfo && citel.msg.contextInfo.participant) ||
            members[Math.floor(Math.random() * members.length)];
        if (citel.sender.split('@')[0] === partner.split('@')[0]) {
            return citel.reply(ui.warn('You want to ship yourself? Pick someone else.'));
        }
        const percent = Math.floor(Math.random() * 100);
        return Void.sendMessage(
            citel.chat,
            {
                text: ui.panel('SHIP', '❣️', [
                    `@${citel.sender.split('@')[0]}  x  @${partner.split('@')[0]}`,
                    ui.field('💘', 'Match', `${percent}%`),
                    verdict(percent),
                ]),
                mentions: [citel.sender, partner],
            },
            { quoted: citel },
        );
    },
);
