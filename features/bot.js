const { prefix, sck, cmd, ui } = require('../lib');
cmd(
    {
        pattern: 'bot',
        desc: 'activates and deactivates bot.\nuse buttons to toggle.',
        category: 'misc',
        filename: __filename,
    },
    async (Void, citel, text, { isCreator }) => {
        if (!citel.isGroup) return citel.reply(ui.text.group);
        if (!isCreator) return;
        switch (text.split(' ')[0]) {
            case 'on':
                {
                    let checkgroup = await sck.findOne({
                        id: citel.chat,
                    });
                    if (!checkgroup) {
                        await new sck({
                            id: citel.chat,
                            botenable: 'true',
                        }).save();
                        return citel.reply(`Successfully Enabled *${ui.text.title}*`);
                    } else {
                        if (checkgroup.botenable == 'true') return citel.reply('*Bot* was already enabled');
                        await sck.updateOne(
                            {
                                id: citel.chat,
                            },
                            {
                                botenable: 'true',
                            },
                        );
                        return citel.reply(`Successfully Enabled *${ui.text.title}*`);
                    }
                }
                break;
            case 'off':
                {
                    {
                        let checkgroup = await sck.findOne({
                            id: citel.chat,
                        });
                        if (!checkgroup) {
                            await new sck({
                                id: citel.chat,
                                botenable: 'false',
                            }).save();
                            return citel.reply(`Successfully disabled *${ui.text.title}*`);
                        } else {
                            if (checkgroup.botenable == 'false') return citel.reply('*Bot* was already disabled');
                            await sck.updateOne(
                                {
                                    id: citel.chat,
                                },
                                {
                                    botenable: 'false',
                                },
                            );
                            return citel.reply(`Successfully disabled *${ui.text.title}*`);
                        }
                    }
                }
                break;
            default: {
                let checkgroup = await sck.findOne({
                    id: citel.chat,
                });
                let buttons = [
                    {
                        buttonId: `${prefix}bot on`,
                        buttonText: {
                            displayText: 'Turn On',
                        },
                        type: 1,
                    },
                    {
                        buttonId: `${prefix}bot off`,
                        buttonText: {
                            displayText: 'Turn Off',
                        },
                        type: 1,
                    },
                ];
                await Void.sendButtonText(
                    citel.chat,
                    buttons,
                    `Bot Status in Group: ${checkgroup.botenable}`,
                    Void.user.name,
                    citel,
                );
            }
        }
    },
);
