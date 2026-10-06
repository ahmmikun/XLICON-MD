const { cmd } = require('../lib');
const { formatMemeText } = require('../lib/shared/memeText');
cmd(
    {
        pattern: 'happydog',
        category: 'troll',
        desc: 'Makes happy dog troll image of given text.',
        use: '<top;bottom>',
        filename: __filename,
    },
    async (Void, citel, text) => {
        try {
            if (!text) return citel.reply('Please provide text! Example: happydog Today is Friday;Weekend is here');
            const parts = text.split(';');
            const top = formatMemeText(parts[0]);
            const bottom = formatMemeText(parts[1] || ' ');
            const url = `https://api.memegen.link/images/custom/${encodeURIComponent(top)}/${encodeURIComponent(bottom)}.png?background=https://i.imgur.com/GYQZS92.jpeg`;
            if (typeof citel.imgurl === 'function') {
                return citel.imgurl(url, 'Secktor Troll Pack (happydog)');
            }
            return Void.sendMessage(
                citel.chat,
                {
                    image: {
                        url,
                    },
                    caption: 'Secktor Troll Pack (happydog)',
                },
                {
                    quoted: citel,
                },
            );
        } catch (e) {
            return citel.reply('Error creating meme: ' + e.message);
        }
    },
);
