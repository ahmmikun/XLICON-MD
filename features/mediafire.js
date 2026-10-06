const { cmd, ui } = require('../lib');
const { mediafire } = require('../lib/mediafire.js');
cmd(
    {
        pattern: 'mediafire',
        desc: 'Downloads zip from Mediafire.',
        category: 'downloader',
        filename: __filename,
        use: '<url of mediafire>',
    },
    async (Void, citel, text) => {
        if (!text) return citel.reply(`Give link ${ui.text.greet}`);
        if (!isUrl(text.split(' ')[0]) && !text.split(' ')[0].includes('mediafire.com'))
            return reply(`The link you provided is invalid`);
        const baby1 = await mediafire(text);
        if (baby1[0].size.split('MB')[0] >= 999) return reply('*File Over Limit* ' + util.format(baby1));
        const result4 = `*ᴵᶻᵁᴷᵁ Mᴇᴅɪᴀғɪʀᴇ Dᴏᴡɴʟᴏᴀᴅᴇʀ*
*Nᴀᴍᴇ* : ${baby1[0].nama}
*Sɪᴢᴇ* : ${baby1[0].size}
*Mɪᴍᴇ* : ${baby1[0].mime}
*Lɪɴᴋ* : ${baby1[0].link}`;
        reply(`${result4}`);
        return Void.sendMessage(
            citel.chat,
            {
                document: {
                    url: baby1[0].link,
                },
                fileName: baby1[0].nama,
                mimetype: baby1[0].mime,
            },
            {
                quoted: citel,
            },
        ).catch((err) => reply('could not find anything'));
    },
);
