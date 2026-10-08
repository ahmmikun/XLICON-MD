const { cmd, ui } = require('../lib');
cmd(
    {
        pattern: 'song',
        desc: 'Sends info about the query(of youtube video/audio).',
        category: 'downloader',
        filename: __filename,
        use: '<faded-Alan walker.>',
    },
    async (Void, citel, text) => {
        if (!text) return citel.reply(`Use ${ui.prefix}song Back in Black`);
        let yts = require('secktor-pack');
        let search = await yts(text);
        let anu = search.videos[0];
        let buttonMessage = {
            image: {
                url: anu.thumbnail,
            },
            caption: `
╔═════════•∞•═╗
│⿻ ${ui.text.title} 
│  *Youtube Player* ✨
│⿻ *Title:* ${anu.title}
│⿻ *Duration:* ${anu.timestamp}
│⿻ *Viewers:* ${anu.views}
│⿻ *Uploaded:* ${anu.ago}
│⿻ *Author:* ${anu.author.name}
╚═•∞•═════════╝
⦿ *Url* : ${anu.url}
`,
            footer: ui.text.footer,
            headerType: 4,
        };
        return Void.sendMessage(citel.chat, buttonMessage, {
            quoted: citel,
        });
    },
);
