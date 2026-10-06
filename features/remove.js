const { plugindb, remove, cmd, Config, ui } = require('../lib');
const fs = require('fs-extra');
cmd(
    {
        pattern: 'remove',
        alias: ['uninstall'],
        category: 'owner',
        desc: 'removes external modules.',
        filename: __filename,
    },
    async (Void, citel, text, { isCreator }) => {
        if (!isCreator) return citel.reply(ui.text.owner);
        if (!text) return await citel.reply('*_Uhh Please, Provide Me Plugin Name_*');
        if (text === 'alls') {
            await plugindb.collection.drop();
            return citel.reply('Deleted all plugins from Secktor.');
        }
        try {
            let kill = await remove(text.split(' ')[0]);
            delete require.cache[require.resolve(__dirname + '/' + text + '.js')];
            fs.unlinkSync(__dirname + '/' + text + '.js');
            await citel.reply(`*_${kill}_* \n*${Config.botname} Restarting*`);
            process.exit(0);
        } catch (e) {
            return await citel.reply('*_Plugin Not Found In Mongodb Server_*');
        }
    },
);
