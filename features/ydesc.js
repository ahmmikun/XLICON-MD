const { cmd, prefix, ui } = require('../lib');
cmd(
    {
        pattern: 'ydesc',
        desc: 'Gives descriptive info of query from youtube..',
        category: 'downloader',
        filename: __filename,
        use: '<yt search text>',
    },
    async (Void, citel, text) => {
        let yts = require('secktor-pack');
        if (!text) return citel.reply(`Example : ${prefix}yts ${ui.text.title} WhatsApp Bot`);
        let search = await yts(text);
        let textt = '*YouTube Search*\n\n Result From ' + text + '\n\n───────────────────\n';
        let no = 1;
        for (let i of search.all) {
            textt += `⚡ No : ${no++}\n ❤Title : ${i.title}\n♫ Type : ${i.type}\n👾Views : ${i.views}\n⌛Duration : ${i.timestamp}\n⬆️Upload At : ${i.ago}\n👑Author : ${i.author.name}\n🎵Url : ${i.url}\n\n──────────────\n\n`;
        }
        return Void.sendMessage(
            citel.chat,
            {
                image: {
                    url: search.all[0].thumbnail,
                },
                caption: textt,
            },
            {
                quoted: citel,
            },
        );
    },
);
