const { sck1, cmd } = require('../lib/');
const axios = require('axios');
cmd(
    {
        pattern: 'quotely',
        desc: 'Makes Sticker of quoted text.',
        alias: ['q'],
        category: 'converter',
        use: '<reply to any message.>',
        filename: __filename,
    },
    async (Void, citel, text) => {
        if (!citel.quoted) return citel.reply('Please quote/reply to any message');
        let textt = citel.quoted.text;
        let pfp;
        try {
            pfp = await Void.profilePictureUrl(citel.quoted.sender, 'image');
        } catch (e) {
            pfp = THUMB_IMAGE;
        }
        let todlinkf = ['#FFFFFF', '#000000'];
        let todf = todlinkf[Math.floor(Math.random() * todlinkf.length)];
        let username = await sck1.findOne({
            id: citel.quoted.sender,
        });
        var tname;
        if (username.name && username.name !== undefined) {
            tname = username.name;
        } else {
            tname = Void.getName(citel.quoted.sender);
        }
        let body = {
            type: 'quote',
            format: 'png',
            backgroundColor: todf,
            width: 512,
            height: 512,
            scale: 3,
            messages: [
                {
                    avatar: true,
                    from: {
                        first_name: tname,
                        language_code: 'en',
                        name: tname,
                        photo: {
                            url: pfp,
                        },
                    },
                    text: textt,
                    replyMessage: {},
                },
            ],
        };
        let res = await axios.post('https://bot.lyo.su/quote/generate', body);
        let img = Buffer.alloc(res.data.result.image.length, res.data.result.image, 'base64');
        return citel.reply(
            img,
            {
                packname: 'Izuku',
                author: 'Quotely',
            },
            'sticker',
        );
    },
);
