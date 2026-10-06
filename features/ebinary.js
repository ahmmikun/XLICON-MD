const { cmd } = require('../lib');
const { eBinary } = require('../lib/binary');
cmd(
    {
        pattern: 'ebinary',
        desc: 'encode binary',
        category: 'misc',
        use: '<query>',
        filename: __filename,
    },
    async (Void, citel, text, { isCreator }) => {
        try {
            if (!text) return citel.reply(`Send text to be encoded.`);
            let textt = text || citel.quoted.text;
            let eb = await eBinary(textt);
            citel.reply(eb);
        } catch (e) {
            console.log(e);
        }
    },
);
