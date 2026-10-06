const { botpic, cmd, ui } = require('../lib');
const axios = require('axios');
cmd(
    {
        pattern: 'repo',
        alias: ['star', 'sc', 'script'],
        desc: 'Sends info about repo.',
        category: 'general',
        filename: __filename,
    },
    async (Void, citel) => {
        let { data } = await axios.get('https://api.github.com/repos/Xcelsama/STAR-MD');
        let cap = `Hey ${citel.pushName}\n
*⭐ TOTᗩᒪ ՏTᗩᖇՏ:* ${data.stargazers_count} stars
*🍽️ ᖴOᖇKՏ:* ${data.forks_count} forks
*🍁 ᖇᗴᑭO:*https://github.com/Xcelsama/STAR-MD
*⚔️ᘜᖇOᑌᑭ:* https://chat.whatsapp.com/Lg0lY4M1k8oDMYzylg86xs
*📡ᑭᑌᗷᒪIᑕ ᘜᖇOᑌᑭ:* https://chat.whatsapp.com/EmP3syvou18HrZk6R6nTAK
*🔍Տᑕᗩᑎ ᑫᖇ:* https://star-md-qr-web-xcelsama-e29e85286f3a.herokuapp.com/
*💻ᑕᕼᗩᑎᑎᗴᒪ ᒪIᑎK:* https://whatsapp.com/channel/0029Va9wmuz8F2pGIURwmo0m
*⚙️DᗴᑭloY YOᑌᖇ Oᗯᑎ:*-
https://dashboard.heroku.com/new?template=https://github.com/Xcelsama/STAR-MD`;
        let buttonMessaged = {
            image: {
                url: await botpic(),
            },
            caption: cap,
            footer: ui.text.footer,
            headerType: 4,
            contextInfo: {
                externalAdReply: {
                    title: 'STAR-REPO',
                    body: 'Easy to Use',
                    thumbnail: log0,
                    mediaType: 4,
                    mediaUrl: '',
                    sourceUrl: ``,
                },
            },
        };
        return await Void.sendMessage(citel.chat, buttonMessaged, {
            quoted: citel,
        });
    },
);
