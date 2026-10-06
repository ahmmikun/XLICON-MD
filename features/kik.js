const { cmd, getAdmin, ui } = require('../lib');
cmd(
    {
        pattern: 'kik',
        desc: 'Kick all numbers from a certain country',
        category: 'group',
        filename: __filename,
    },
    async (Void, citel, text, { isCreator }) => {
        if (!citel.isGroup) return citel.reply(ui.text.group);
        if (!text) return await citel.reply('*Provide Me Country Code. Example: .kik 91*');
        const groupMetadata = citel.isGroup ? await Void.groupMetadata(citel.chat).catch((e) => {}) : '';
        const groupAdmins = await getAdmin(Void, citel);
        let isAdmins = citel.isGroup ? groupAdmins.includes(citel.sender) : false;
        if (!isAdmins) {
            if (isCreator) citel.reply('*Hey Owner, You Are not Admin Here*');
            else return citel.reply(ui.text.admin);
        }
        let find = text.split(' ')[0].replace('+', '');
        let error = '*These Users Not Kicked* \n\t';
        let users = await groupMetadata.participants;
        let hmanykik = 0;
        let iskikstart = false;
        const botNumber = await Void.decodeJid(Void.user.id);
        for (let i of users) {
            let isuseradmin = groupAdmins.includes(i.id) || false;
            if (i.id.startsWith(find) && !isuseradmin) {
                if (!iskikstart) {
                    iskikstart = true;
                    await citel.reply(`*_Kicking ALL the Users With ${find} Country Code_*`);
                }
                try {
                    await Void.groupParticipantsUpdate(citel.chat, [i.id], 'remove');
                    hmanykik++;
                } catch (e) {
                    console.log('Error While Kicking : ', e);
                }
            }
        }
        if (hmanykik == 0) return await citel.reply(`*_Ahh, There Is No User Found With ${find} Country Code_*`);
        else return await citel.reply(`*_Hurray, ${hmanykik.toString()} Users With ${find} Country Code kicked_*`);
    },
);
