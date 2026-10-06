const { cmd, botSettings } = require('../lib');
const { BGM_LIST } = require('../lib/shared/bgmList');
cmd(
    {
        on: 'body',
    },
    async (Void, citel, { body }) => {
        try {
            let isEnabled = global.bgm_enabled === 'true';
            if (global.bgm_enabled === undefined) {
                let setting = await botSettings.findOne({
                    id: 'main',
                });
                isEnabled = setting && setting.bgm === 'true';
                global.bgm_enabled = isEnabled ? 'true' : 'false';
            }
            if (!isEnabled || !body) return;
            let lower = body.toLowerCase();
            for (let key in BGM_LIST) {
                let regex = new RegExp(`\\b${key}\\b`, 'i');
                if (regex.test(lower)) {
                    return await Void.sendMessage(
                        citel.chat,
                        {
                            audio: {
                                url: BGM_LIST[key],
                            },
                            mimetype: 'audio/mpeg',
                        },
                        {
                            quoted: citel,
                        },
                    );
                }
            }
        } catch (e) {}
    },
);
