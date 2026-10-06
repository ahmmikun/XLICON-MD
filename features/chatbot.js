const { prefix, cmd, ui } = require('../lib');
cmd(
    {
        pattern: 'chatbot',
        desc: 'activates and deactivates chatbot.\nuse buttons to toggle.',
        category: 'misc',
        filename: __filename,
    },
    async (Void, citel, text, { isCreator }) => {
        if (!isCreator) return citel.reply(ui.text.owner);
        const { chatbot } = require('../lib/');
        switch (text.split(' ')[0]) {
            case 'on':
                {
                    let chatbott = await chatbot.findOne({
                        id: 'chatbot',
                    });
                    if (!chatbott) {
                        await new chatbot({
                            id: 'chatbot',
                            worktype: 'true',
                        }).save();
                        return citel.reply('Chatbot activated successfully.');
                    } else {
                        if (chatbott.worktype == 'true') return citel.reply('Chatbot has already been enabled.');
                        await chatbot.updateOne(
                            {
                                id: 'chatbot',
                            },
                            {
                                worktype: 'true',
                            },
                        );
                        citel.reply('Enabled chatbot successfully.');
                        return;
                    }
                }
                break;
            case 'off':
                {
                    let chatbott = await chatbot.findOne({
                        id: 'chatbot',
                    });
                    if (!chatbott) {
                        await new chatbot({
                            id: 'chatbot',
                            worktype: 'false',
                        }).save();
                        return citel.reply('Chatbot deactivated successfully.');
                    } else {
                        if (chatbott.worktype == 'false') return citel.reply('Chatbot has  already been disabled.');
                        await chatbot.updateOne(
                            {
                                id: 'chatbot',
                            },
                            {
                                worktype: 'false',
                            },
                        );
                        citel.reply('Disabled chatbot successfully.');
                        return;
                    }
                }
                break;
            default: {
                let buttons = [
                    {
                        buttonId: `${prefix}chatbot on`,
                        buttonText: {
                            displayText: 'Turn On',
                        },
                        type: 1,
                    },
                    {
                        buttonId: `${prefix}chatbot off`,
                        buttonText: {
                            displayText: 'Turn Off',
                        },
                        type: 1,
                    },
                ];
                let chatbott = await chatbot.findOne({
                    id: 'chatbot',
                });
                await Void.sendButtonText(
                    citel.chat,
                    buttons,
                    `Chatbot Status: ${chatbott.worktype} `,
                    'Izuku-Md',
                    citel,
                );
                citel.reply(`Chatbot Status: ${chatbott.worktype} \n*Use:* ${prefix}chatbot on\n${prefix}chatbot off`);
            }
        }
    },
);
