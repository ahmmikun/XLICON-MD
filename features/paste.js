const { cmd, Config, ui } = require('../lib');
const axios = require('axios');
const util = require('util');

cmd(
    {
        pattern: 'paste',
        desc: 'create paste of text.',
        category: 'tools',
        filename: __filename,
    },
    async (Void, citel, text) => {
        const content = citel.quoted ? citel.quoted.text : citel.text;
        if (!content) {
            return citel.reply(ui.info('Reply to a message or send text after the command.'));
        }
        if (!Config.telegraphToken) {
            return citel.reply(
                ui.warn('Telegraph is not configured. Set TELEGRAPH_ACCESS_TOKEN in config.env.'),
            );
        }

        try {
            const body = new URLSearchParams({
                access_token: Config.telegraphToken,
                title: `${Config.botname} Paste`,
                author_name: Config.owner.name,
                content: JSON.stringify([{ tag: 'p', children: [String(content)] }]),
                return_content: 'true',
            });
            const { data } = await axios.post('https://api.telegra.ph/createPage', body.toString(), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                timeout: 15000,
            });
            if (!data || data.ok !== true) {
                return citel.reply(ui.fail('Telegraph rejected the paste.'));
            }
            return citel.reply(
                `*Paste created on telegraph*\nName:-${util.format(data.result.title)} \nUrl:- ${util.format(
                    data.result.url,
                )}`,
            );
        } catch (error) {
            return citel.reply(ui.fail(`Could not create paste: ${error.message}`));
        }
    },
);
