const { cmd, Config } = require('../lib');
const axios = require('axios');
const fetch = require('node-fetch');
cmd(
    {
        pattern: 'chat',
        alias: ['gpt'],
        desc: 'chat with an AI(GPT)',
        category: 'AI',
        use: '<◡̈⋆🅷🅸(●’◡’●)ﾉ,𝚂𝚝𝚊𝚛>',
        filename: __filename,
    },
    async (Void, citel, text) => {
        let zx = text.length;
        if (zx < 8) {
            let { data } = await axios.get(
                `http://api.brainshop.ai/get?bid=167991&key=aozpOoNOy3dfLgmB&uid=[${citel.sender.split('@')[0]}]&msg=[${text}]`,
            );
            return citel.reply(data.cnt);
        }
        if (!text) return citel.reply(`Hey there! ${citel.pushName}. How are you doing these days?`);
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Config.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You',
                    },
                    {
                        role: 'user',
                        content: text,
                    },
                ],
            }),
        });
        const data = await response.json();
        console.log('GPT REPONCE : ', data);
        if (!data.choices || data.choices.length === 0) {
            citel.reply('*Invalid ChatGPT API Key, Please Put New Key*');
        }
        return await citel.reply(data.choices[0].message.content);
    },
);
