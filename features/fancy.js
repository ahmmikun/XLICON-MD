const { tiny, fancytext, listall, cmd } = require('../lib/');
cmd(
    {
        pattern: 'fancy',
        desc: 'Makes stylish/fancy given text',
        category: 'converter',
        use: '56 Xlicon',
        react: '🦄',
        filename: __filename,
    },
    async (Void, citel, text) => {
        if (isNaN(text.split(' ')[0]) || !text) {
            let text = tiny('Fancy text generator\n\nExample: *fancy 56 Xlicon\n\n');
            listall('XLICON-MD').forEach((txt, num) => {
                text += `${(num += 1)} ${txt}\n`;
            });
            return await citel.reply(text);
        }
        let fancytextt = await fancytext(`${text.slice(2)}`, text.split(' ')[0]);
        citel.reply(fancytextt);
    },
);
