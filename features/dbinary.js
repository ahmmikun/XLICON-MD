const { cmd } = require('../lib');
const { dBinary } = require('../lib/binary');
cmd(
    {
        pattern: 'dbinary',
        desc: 'decode binary',
        category: 'misc',
        use: '<query>',
        filename: __filename,
    },
    async (Void, citel, text, { isCreator }) => {
        try {
            if (!text) return citel.reply(`Send text to be decoded.`);
            let eb = await dBinary(text);
            citel.reply(eb);
        } catch (e) {
            console.log(e);
        }
    },
);
