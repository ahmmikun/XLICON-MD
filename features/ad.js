const { Create_Url } = require('../lib/shared/imageEdit');
const { cmd } = require('../lib');
cmd(
    {
        pattern: 'ad',
        category: 'editor',
        filename: __filename,
        desc: 'pic Editor.',
    },
    async (Void, citel, text, { cmdName, args, isCreator, body, budy }) => {
        if (!citel.quoted) return await citel.reply(`*Reply To Any Image* ${this.cmd}`);
        if (citel.quoted.mtype != 'imageMessage') return await citel.reply('Uhh Please, Reply To An Image');
        await Create_Url(Void, citel, 'ad');
    },
);
