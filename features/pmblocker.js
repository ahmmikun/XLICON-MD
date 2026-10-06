const { cmd, botSettings, ui } = require('../lib');
cmd(
    {
        pattern: 'pmblocker',
        alias: ['pblocker'],
        category: 'owner',
        desc: 'Turn on/off PM blocking system.',
        filename: __filename,
    },
    async (Void, citel, text, { isCreator, args }) => {
        if (!isCreator) return citel.reply(ui.text.owner);
        if (!args || !args[0]) {
            let current = global.pmblocker;
            if (current === undefined) {
                try {
                    let setting = await botSettings.findOne({
                        id: 'main',
                    });
                    current = setting ? setting.pmblock : 'false';
                } catch (e) {
                    current = 'false';
                }
            }
            return citel.reply(
                `Please provide option: on/off (or true/false)\nCurrent status: *${current === 'true' ? 'ON' : 'OFF'}*`,
            );
        }
        let input = args[0].toLowerCase();
        let state = 'false';
        if (['on', 'true', 'enable', 'act'].includes(input)) {
            state = 'true';
        } else if (['off', 'false', 'disable', 'deact'].includes(input)) {
            state = 'false';
        } else {
            return citel.reply('Invalid option! Use .pmblocker on or .pmblocker off');
        }
        try {
            let setting = await botSettings.findOne({
                id: 'main',
            });
            if (!setting) {
                await new botSettings({
                    id: 'main',
                    pmblock: state,
                }).save();
            } else {
                await botSettings.updateOne(
                    {
                        id: 'main',
                    },
                    {
                        pmblock: state,
                    },
                );
            }
            global.pmblocker = state;
            return citel.reply(`PM Blocker has been turned *${state === 'true' ? 'ON' : 'OFF'}*.`);
        } catch (e) {
            global.pmblocker = state;
            return citel.reply(
                `PM Blocker set to *${state === 'true' ? 'ON' : 'OFF'}*. (Memory state updated: ${e.message})`,
            );
        }
    },
);
