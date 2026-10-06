const { cmd } = require('../lib');
const maker = require('mumaker');
const { cap } = require('../lib/shared/deepsea');
cmd(
    {
        pattern: 'sand',
        category: 'textpro',
        desc: 'Some text to image feature with various styles.',
    },
    async (Void, citel, text) => {
        if (!text) return citel.reply('_Need text._');
        let anu = await maker.textpro('https://textpro.me/write-in-sand-summer-beach-free-online-991.html', text);
        Void.sendMessage(
            citel.chat,
            {
                image: {
                    url: anu.image,
                },
                caption: cap,
            },
            {
                quoted: citel,
            },
        );
    },
);
