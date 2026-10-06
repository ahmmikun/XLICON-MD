const { cmd, botSettings, ui } = require('../lib');
const { BGM_LIST } = require('../lib/shared/bgmList');
cmd(
    {
        pattern: 'bgm',
        category: 'misc',
        desc: 'Turns on/off automatic background audio responses.',
        filename: __filename,
    },
    async (Void, citel, text, { isCreator, args }) => {
        if (!isCreator) return citel.reply(ui.text.owner);
        if (!args || !args[0]) {
            let current = global.bgm_enabled;
            if (current === undefined) {
                try {
                    let setting = await botSettings.findOne({
                        id: 'main',
                    });
                    current = setting ? setting.bgm : 'false';
                } catch (e) {
                    current = 'false';
                }
            }
            let keys = Object.keys(BGM_LIST).join(', ');
            return citel.reply(
                `*BGM Settings*\nStatus: *${current === 'true' ? 'ON' : 'OFF'}*\n\n` +
                    `Use *.bgm on* or *.bgm off* to toggle.\n` +
                    `Triggers available: ${keys}`,
            );
        }
        let input = args[0].toLowerCase();
        let state = 'false';
        if (['on', 'true', 'enable', 'act'].includes(input)) {
            state = 'true';
        } else if (['off', 'false', 'disable', 'deact'].includes(input)) {
            state = 'false';
        } else {
            return citel.reply('Invalid option! Use .bgm on or .bgm off');
        }
        try {
            let setting = await botSettings.findOne({
                id: 'main',
            });
            if (!setting) {
                await new botSettings({
                    id: 'main',
                    bgm: state,
                }).save();
            } else {
                await botSettings.updateOne(
                    {
                        id: 'main',
                    },
                    {
                        bgm: state,
                    },
                );
            }
            global.bgm_enabled = state;
            return citel.reply(`BGM audio responses have been turned *${state === 'true' ? 'ON' : 'OFF'}*.`);
        } catch (e) {
            global.bgm_enabled = state;
            return citel.reply(`BGM audio set to *${state === 'true' ? 'ON' : 'OFF'}*. (Memory state updated)`);
        }
    },
);
