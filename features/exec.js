const { cmd, Config, ui } = require('../lib');
const { http } = require('../lib/api');

cmd(
    {
        pattern: 'exec',
        desc: 'Run quoted code in a given language',
        use: '<language> (reply to the code)',
        category: 'misc',
        filename: __filename,
    },
    async (Void, citel, text) => {
        const { jdoodleId, jdoodleSecret } = Config.keys;
        if (!jdoodleId || !jdoodleSecret) return citel.reply(ui.text.working);
        const [language, ...input] = text.trim().split(/\s+/);
        if (!language || !citel.quoted || !citel.quoted.text) {
            return citel.reply(ui.info(`Reply to some code with ${ui.prefix}exec <language>, e.g. ${ui.prefix}exec python3`));
        }
        const { data } = await http.post(
            'https://api.jdoodle.com/v1/execute',
            { script: citel.quoted.text, language, versionIndex: '0', stdin: input.join(' '), clientId: jdoodleId, clientSecret: jdoodleSecret },
            { timeout: 30000 },
        );
        return citel.reply(`> ${language}\n\n\`\`\`${data.output}\`\`\``);
    },
);
