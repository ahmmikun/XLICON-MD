const fs = require('fs-extra');
const { cmd, isUrl, plugindb, ui } = require('../lib');
const { isExternalPluginsEnabled } = require('../lib/security');
const { installPluginFromUrl } = require('../lib/pluginInstaller');

const featuresDir = __dirname;

cmd(
    {
        pattern: 'install',
        category: 'owner',
        desc: 'Installs an external plugin from a trusted raw source URL.',
        use: '<url>',
        filename: __filename,
    },
    async (Void, citel, text, { isCreator }) => {
        if (!isCreator) return citel.reply(ui.text.owner);

        if (!isExternalPluginsEnabled()) {
            return citel.reply(
                ui.warn(
                    'External plugins are disabled. Set ALLOW_EXTERNAL_PLUGINS=true in config.env and restart the bot to enable them.',
                ),
            );
        }

        const sourceText = String(
            text || (citel.quoted && citel.quoted.text) || citel.body || '',
        ).trim();
        const urls = isUrl(sourceText) || [];
        if (!urls.length) {
            return citel.reply(
                ui.info(
                    'Send a plugin URL, for example: .install https://raw.githubusercontent.com/user/repo/main/plugin.js',
                ),
            );
        }

        for (const url of urls) {
            let plugin;
            try {
                plugin = await installPluginFromUrl(url, featuresDir);

                // Make sure the downloaded code is at least loadable before it is persisted.
                delete require.cache[require.resolve(plugin.file)];
                require(plugin.file);

                await new plugindb({ id: plugin.id, url: plugin.url }).save();
                await citel.reply(ui.ok(`Installed plugin *${plugin.id}*`));
            } catch (error) {
                if (plugin) {
                    try {
                        delete require.cache[require.resolve(plugin.file)];
                    } catch (cacheError) {}
                    await fs.remove(plugin.file).catch(() => {});
                }
                await citel.reply(ui.fail(`Could not install ${url}: ${error.message}`));
            }
        }
    },
);
