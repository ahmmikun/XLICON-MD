const { cmd } = require('../lib');
const maker = require('mumaker');
const { cap } = require('../lib/shared/deepsea');
cmd(
    {
        pattern: 'discovery',
        category: 'textpro',
        desc: 'Some text to image feature with various styles.',
    },
    async (Void, citel, text) => {
        if (!text) return citel.reply('_Need text._');
        let anu = await maker.textpro('https://textpro.me/create-space-text-effects-online-free-1042.html', text);
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
