const { cmd } = require('../lib');
const DB = require('../lib/scraper');
cmd(
    {
        pattern: 'update',
        desc: "Shows repo\'s refreshed commits.",
        category: 'tools',
        filename: __filename,
    },
    async (Void, citel, text, { isCreator }) => {
        if (!isCreator) return citel.reply('This command is only for my owner');
        let commits = await DB.syncgit();
        if (commits.total === 0) {
            citel.reply(`Hey ${citel.pushName}. You have latest version installed.`);
        } else {
            let update = await DB.sync();
            return await Void.sendMessage(citel.chat, {
                text: update,
            });
        }
    },
);
