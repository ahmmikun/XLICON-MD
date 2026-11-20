const fs = require('fs-extra');
const { plugindb, remove, cmd, Config, ui } = require('../lib');
const { sanitizePluginId, pluginFilePath, legacyPluginFilePath } = require('../lib/security');

cmd(
    {
        pattern: 'remove',
        alias: ['uninstall'],
        category: 'owner',
        desc: 'removes external plugins.',
        filename: __filename,
    },
    async (Void, citel, text, { isCreator }) => {
        if (!isCreator) return citel.reply(ui.text.owner);
        if (!text) return citel.reply('*_Uhh Please, Provide Me Plugin Name_*');
        if (text.trim() === 'alls') {
            await plugindb.collection.drop();
            return citel.reply('Deleted all external plugins.');
        }

        let id;
        try {
            id = sanitizePluginId(text.split(' ')[0]);
        } catch (error) {
            return citel.reply(ui.fail('Invalid plugin name.'));
        }

        const record = await plugindb.findOne({ id }).catch(() => null);
        const files = [pluginFilePath(__dirname, id)];
        // Only fall back to the legacy "<id>.js" name for plugins recorded in the database,
        // so a command cannot delete a built-in feature file.
        if (record) files.push(legacyPluginFilePath(__dirname, id));

        let deleted = false;
        for (const file of files) {
            if (!(await fs.pathExists(file))) continue;
            try {
                delete require.cache[require.resolve(file)];
            } catch (error) {}
            await fs.remove(file);
            deleted = true;
        }

        await remove(id);
        if (!deleted && !record) {
            return citel.reply(ui.fail('Plugin not found.'));
        }

        await citel.reply(`*_Plugin ${id} removed._* \n*${Config.botname} Restarting*`);
        process.exit(0);
    },
);
