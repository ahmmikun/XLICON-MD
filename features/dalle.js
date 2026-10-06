const { cmd, Config } = require('../lib');
const fetch = require('node-fetch');
cmd(
    {
        pattern: 'dalle',
        alias: ['dall', 'dall-e'],
        desc: 'Create Image by AI',
        category: 'AI',
        use: '<an astronaut in mud.>',
        filename: __filename,
    },
    async (Void, citel, text, { isCreator }) => {
        if (Config.OPENAI_API_KEY == '')
            return citel.reply(
                'You Dont Have OPENAI_API_KEY \nPlease Create OPEN API KEY from Given Link \nhttps://platform.openai.com/account/api-keys',
            );
        if (!text) return citel.reply(`*Give Me A Query To Get Dall-E Reponce ?*`);
        const imageSize = '256x256';
        const apiUrl = 'https://api.openai.com/v1/images/generations';
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Config.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'image-alpha-001',
                prompt: text,
                size: imageSize,
                response_format: 'url',
            }),
        });
        const data = await response.json();
        let buttonMessage = {
            image: {
                url: data.data[0].url,
            },
            caption: '*---Your DALL-E Result---*',
        };
        Void.sendMessage(citel.chat, {
            image: {
                url: data.data[0].url,
            },
        });
    },
);
