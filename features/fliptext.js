const { prefix, cmd } = require('../lib');
cmd(
    {
        pattern: 'fliptext',
        desc: 'Flips given text.',
        category: 'misc',
        use: '<query>',
        filename: __filename,
    },
    async (Void, citel, text) => {
        if (!text) return citel.reply(`Example : ${prefix}fliptext Back in black`);
        flipe = text.split('').reverse().join('');
        citel.reply(`\`\`\`「  Text Flipper Tool  」\`\`\`\n*IGiven text :*\n${text}\n*Fliped text :*\n${flipe}`);
    },
);
