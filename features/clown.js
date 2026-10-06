const { Create_Url } = require('../lib/shared/imageEdit');
const { cmd } = require('../lib');
cmd(
    {
        pattern: 'clown',
        category: 'editor',
        filename: __filename,
        desc: 'pic Editor.',
    },
    async (Void, citel, text) => {
        if (!citel.quoted) return await citel.reply(`*Reply To Any Image*`);
        if (citel.quoted.mtype != 'imageMessage') return await citel.reply('Uhh Please, Reply To An Image');
        await Create_Url(Void, citel, 'clown');
    },
);
