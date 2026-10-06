const { cmd, botSettings } = require('../lib');
cmd(
    {
        on: 'body',
    },
    async (Void, citel, { isCreator, body }) => {
        try {
            if (citel.isGroup || isCreator) return;
            let isEnabled = global.pmblocker === 'true';
            if (global.pmblocker === undefined) {
                let setting = await botSettings.findOne({
                    id: 'main',
                });
                isEnabled = setting && setting.pmblock === 'true';
                global.pmblocker = isEnabled ? 'true' : 'false';
            }
            if (!isEnabled) return;
            if (body || citel.text) {
                await citel.reply('PM blocking system is active. You are being blocked! :)');
                if (typeof Void.updateBlockStatus === 'function') {
                    await Void.updateBlockStatus(citel.sender, 'block');
                }
            }
        } catch (e) {}
    },
);
