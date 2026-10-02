const { cmd } = require('../lib');

function formatMemeText(text) {
    if (!text || text.trim() === '') return '_';
    return text.trim()
        .replace(/_/g, '__')
        .replace(/-/g, '--')
        .replace(/ /g, '_')
        .replace(/\?/g, '~q')
        .replace(/%/g, '~p')
        .replace(/#/g, '~h')
        .replace(/\//g, '~s');
}

//---------------------------------------------------------------------------
cmd({
    pattern: "askdog",
    category: "troll",
    desc: "Makes troll image of given text.",
    use: "<top;bottom>",
    filename: __filename,
},
async (Void, citel, text) => {
    try {
        if (!text) return citel.reply("Please provide text! Example: askdog What is love?;Baby dont hurt me");
        const parts = text.split(";");
        const top = formatMemeText(parts[0]);
        const bottom = formatMemeText(parts[1] || " ");
        const url = `https://api.memegen.link/images/custom/${encodeURIComponent(top)}/${encodeURIComponent(bottom)}.png?background=https://i.imgur.com/o07ESQe.jpeg`;
        
        if (typeof citel.imgurl === 'function') {
            return citel.imgurl(url, 'Secktor Troll Pack (askdog)');
        }
        return Void.sendMessage(citel.chat, { image: { url }, caption: 'Secktor Troll Pack (askdog)' }, { quoted: citel });
    } catch (e) {
        return citel.reply("Error creating meme: " + e.message);
    }
});

//---------------------------------------------------------------------------
cmd({
    pattern: "happydog",
    category: "troll",
    desc: "Makes happy dog troll image of given text.",
    use: "<top;bottom>",
    filename: __filename,
},
async (Void, citel, text) => {
    try {
        if (!text) return citel.reply("Please provide text! Example: happydog Today is Friday;Weekend is here");
        const parts = text.split(";");
        const top = formatMemeText(parts[0]);
        const bottom = formatMemeText(parts[1] || " ");
        const url = `https://api.memegen.link/images/custom/${encodeURIComponent(top)}/${encodeURIComponent(bottom)}.png?background=https://i.imgur.com/GYQZS92.jpeg`;

        if (typeof citel.imgurl === 'function') {
            return citel.imgurl(url, 'Secktor Troll Pack (happydog)');
        }
        return Void.sendMessage(citel.chat, { image: { url }, caption: 'Secktor Troll Pack (happydog)' }, { quoted: citel });
    } catch (e) {
        return citel.reply("Error creating meme: " + e.message);
    }
});

//---------------------------------------------------------------------------
cmd({
    pattern: "doggy",
    category: "troll",
    desc: "Makes Doge troll meme of given text.",
    use: "<top;bottom>",
    filename: __filename,
},
async (Void, citel, text) => {
    try {
        if (!text) return citel.reply("Please provide text! Example: doggy Such code;Much wow");
        const parts = text.split(";");
        const top = formatMemeText(parts[0]);
        const bottom = formatMemeText(parts[1] || " ");
        const url = `https://api.memegen.link/images/doge/${encodeURIComponent(top)}/${encodeURIComponent(bottom)}.png`;

        if (typeof citel.imgurl === 'function') {
            return citel.imgurl(url, 'Secktor Troll Pack (doggy)');
        }
        return Void.sendMessage(citel.chat, { image: { url }, caption: 'Secktor Troll Pack (doggy)' }, { quoted: citel });
    } catch (e) {
        return citel.reply("Error creating meme: " + e.message);
    }
});
