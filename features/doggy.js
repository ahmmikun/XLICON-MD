const { cmd } = require('../lib');
const { formatMemeText } = require('../lib/shared/memeText');
cmd(
    {
        pattern: 'doggy',
        category: 'troll',
        desc: 'Makes Doge troll meme of given text.',
        use: '<top;bottom>',
        filename: __filename,
    },
    async (Void, citel, text) => {
        try {
            if (!text) return citel.reply('Please provide text! Example: doggy Such code;Much wow');
            const parts = text.split(';');
            const top = formatMemeText(parts[0]);
            const bottom = formatMemeText(parts[1] || ' ');
            const url = `https://api.memegen.link/images/doge/${encodeURIComponent(top)}/${encodeURIComponent(bottom)}.png`;
            if (typeof citel.imgurl === 'function') {
                return citel.imgurl(url, 'Secktor Troll Pack (doggy)');
            }
            return Void.sendMessage(
                citel.chat,
                {
                    image: {
                        url,
                    },
                    caption: 'Secktor Troll Pack (doggy)',
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
