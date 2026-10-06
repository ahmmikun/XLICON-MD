const { cmd } = require('../lib');
cmd(
    {
        pattern: 'wm',
        desc: 'Makes wa.me of quoted or mentioned user.',
        category: 'misc',
        filename: __filename,
    },
    async (Void, citel, text) => {
        let users = citel.mentionedJid
            ? citel.mentionedJid[0].split('@')[0]
            : citel.quoted
              ? citel.quoted.sender.split('@')[0]
              : text.replace('@')[0];
        return citel.reply(`https://wa.me/${users}`);
    },
);
