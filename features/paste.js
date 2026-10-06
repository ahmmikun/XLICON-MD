const { cmd } = require('../lib');
const axios = require('axios');
const util = require('util');
cmd(
    {
        pattern: 'paste',
        desc: 'create paste of text.',
        category: 'tools',
        filename: __filename,
    },
    async (Void, citel, text) => {
        let a = citel.quoted ? citel.quoted.text : citel.text;
        let { data } = await axios.get(
            `https://api.telegra.ph/createPage?access_token=d3b25feccb89e508a9114afb82aa421fe2a9712b963b387cc5ad71e58722&title=STAR-MD+Bot&author_name=Excel &content=[%7B"tag":"p","children":["${a.replace(/ /g, '+')}"]%7D]&return_content=true`,
        );
        return citel.reply(
            `*Paste created on telegraph*\nName:-${util.format(data.result.title)} \nUrl:- ${util.format(data.result.url)}`,
        );
    },
);
