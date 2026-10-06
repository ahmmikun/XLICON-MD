const { cmd, getAdmin, ui } = require('../lib');
const fs = require('fs-extra');
cmd(
    {
        pattern: 'grouppic',
        desc: 'Sets a profile pic in Group..',
        category: 'group',
        filename: __filename,
    },
    async (Void, citel, text) => {
        if (!citel.isGroup) return citel.reply(ui.text.group);
        const groupAdmins = await getAdmin(Void, citel);
        const botNumber = await Void.decodeJid(Void.user.id);
        const isBotAdmins = citel.isGroup ? groupAdmins.includes(botNumber) : false;
        const isAdmins = citel.isGroup ? groupAdmins.includes(citel.sender) : false;
        let mime = citel.quoted.mtype;
        if (!citel.isGroup) citel.reply(ui.text.group);
        if (!isAdmins) citel.reply(ui.text.admin);
        if (!isBotAdmins) citel.reply(ui.text.botadmin);
        if (!citel.quoted) return citel.reply(`Send/Reply Image With Caption ${command}`);
        if (!/image/.test(mime)) return citel.reply(`Send/Reply Image With Caption ${command}`);
        if (/webp/.test(mime)) return citel.reply(`Send/Reply Image With Caption ${command}`);
        let media = await Void.downloadAndSaveMediaMessage(citel.quoted);
        await Void.updateProfilePicture(citel.chat, {
            url: media,
        }).catch((err) => fs.unlinkSync(media));
        citel.reply(ui.text.success);
    },
);
