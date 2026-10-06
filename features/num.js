const { cmd, Config, getAdmin, ui } = require('../lib');
cmd(
    {
        pattern: 'num',
        desc: 'get all numbers from a certain country',
        category: 'group',
        filename: __filename,
    },
    async (Void, citel, text, { isCreator }) => {
        if (!citel.isGroup) return citel.reply(ui.text.group);
        if (!text) return await citel.reply('*Provide Me Country Code. Example: .num 91*');
        const groupMetadata = citel.isGroup ? await Void.groupMetadata(citel.chat).catch((e) => {}) : '';
        const groupAdmins = await getAdmin(Void, citel);
        const isAdmins = citel.isGroup ? groupAdmins.includes(citel.sender) : false;
        if (!isAdmins && !isCreator) return citel.reply(ui.text.admin);
        let find = text.split(' ')[0];
        let users = await groupMetadata.participants;
        let nums = `*List Of Users With ${find} Country Code*\n`;
        let num = '';
        for (let i of users) {
            if (i.id.startsWith(find)) num += i.id.split('@')[0] + '\n';
        }
        if (!num) {
            nums = `*There Is No Users With ${find} Country Code*`;
        } else {
            nums += num + Config.caption;
        }
        await citel.reply(nums);
    },
);
