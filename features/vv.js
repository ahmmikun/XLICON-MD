const { cmd } = require('../lib/');
cmd(
    {
        pattern: 'vv',
        alias: ['viewonce', 'retrive'],
        desc: 'Flips given text.',
        category: 'misc',
        use: '<query>',
        filename: __filename,
    },
    async (Void, citel, text) => {
        try {
            const quot = citel.msg.contextInfo.quotedMessage.viewOnceMessageV2;
            if (quot) {
                if (quot.message.imageMessage) {
                    console.log('Quot Entered');
                    let cap = quot.message.imageMessage.caption;
                    let anu = await Void.downloadAndSaveMediaMessage(quot.message.imageMessage);
                    return Void.sendMessage(citel.chat, {
                        image: {
                            url: anu,
                        },
                        caption: cap,
                    });
                }
                if (quot.message.videoMessage) {
                    let cap = quot.message.videoMessage.caption;
                    let anu = await Void.downloadAndSaveMediaMessage(quot.message.videoMessage);
                    return Void.sendMessage(citel.chat, {
                        video: {
                            url: anu,
                        },
                        caption: cap,
                    });
                }
            }
        } catch (e) {
            console.log('error', e);
        }
        if (!citel.quoted) return citel.reply('```Uh Please Reply A ViewOnce Message```');
        if (citel.quoted.mtype === 'viewOnceMessage') {
            console.log('ViewOnce Entered');
            if (citel.quoted.message.imageMessage) {
                let cap = citel.quoted.message.imageMessage.caption;
                let anu = await Void.downloadAndSaveMediaMessage(citel.quoted.message.imageMessage);
                Void.sendMessage(citel.chat, {
                    image: {
                        url: anu,
                    },
                    caption: cap,
                });
            } else if (citel.quoted.message.videoMessage) {
                let cap = citel.quoted.message.videoMessage.caption;
                let anu = await Void.downloadAndSaveMediaMessage(citel.quoted.message.videoMessage);
                Void.sendMessage(citel.chat, {
                    video: {
                        url: anu,
                    },
                    caption: cap,
                });
            }
        } else return citel.reply('```This is Not A ViewOnce Message```');
    },
);
