const { getAdmin, prefix, cmd, ui } = require('../lib');
cmd(
    {
        pattern: 'antilink',
        desc: 'activates and deactivates antilink.\nuse buttons to toggle.',
        category: 'group',
        filename: __filename,
    },
    async (Void, citel, text) => {
        if (!citel.isGroup) return citel.reply(ui.text.group);
        const groupAdmins = await getAdmin(Void, citel);
        const botNumber = await Void.decodeJid(Void.user.id);
        const isBotAdmins = citel.isGroup ? groupAdmins.includes(botNumber) : false;
        const isAdmins = citel.isGroup ? groupAdmins.includes(citel.sender) : false;
        if (!isAdmins) return citel.reply(ui.text.admin);
        if (!isBotAdmins) return citel.reply(ui.text.botadmin);
        let buttons = [
            {
                buttonId: `${prefix}act antilink`,
                buttonText: {
                    displayText: 'Turn On',
                },
                type: 1,
            },
            {
                buttonId: `${prefix}deact antilink`,
                buttonText: {
                    displayText: 'Turn Off',
                },
                type: 1,
            },
        ];
        await Void.sendButtonText(citel.chat, buttons, `Activate antilink:Deletes Link + kick`, Void.user.name, citel);
    },
);
