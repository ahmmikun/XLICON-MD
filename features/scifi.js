const { cmd } = require('../lib');
const maker = require('mumaker');
const { cap } = require('../lib/shared/deepsea');
cmd(
    {
        pattern: 'scifi',
        category: 'textpro',
        desc: 'Some text to image feature with various styles.',
    },
    async (Void, citel, text) => {
        if (!text) return citel.reply('_Need text._');
        let anu = await maker.textpro('https://textpro.me/create-3d-sci-fi-text-effect-online-1050.html', text);
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
