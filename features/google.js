const { cmd } = require('../lib');
cmd(
    {
        pattern: 'google',
        alias: ['search', 'gsearch'],
        category: 'search',
        desc: 'Sends info of given query from Google Search.',
        use: '<text>',
        filename: __filename,
    },
    async (Void, citel, text) => {
        if (!text) return citel.reply(`give me a query\n*Example : .google Who is Suhail Tech.*`);
        let google = require('../lib/google-search');
        google({
            query: text,
        }).then((res) => {
            let msg = `🦄xʟɪᴄᴏɴ ɢᴏᴏɢʟᴇ sᴇᴀʀᴄʜ  : ${text} \n\n`;
            for (let g of res) {
                msg += `📌 Title : ${g.title}\n`;
                msg += `🦄  Description : ${g.snippet}\n`;
                msg += `🔗 Link : ${g.link}\n\n────────────────────────\n\n`;
            }
            return citel.reply(msg);
        });
    },
);
