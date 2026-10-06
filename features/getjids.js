const { cmd, sleep, ui } = require('../lib');
cmd(
    {
        pattern: 'getjids',
        desc: 'Sends chat id of every groups.',
        category: 'group',
        filename: __filename,
    },
    async (Void, citel, text, { isCreator }) => {
        if (!isCreator) return citel.reply(ui.text.owner);
        let getGroups = await Void.groupFetchAllParticipating();
        let groups = Object.entries(getGroups)
            .slice(0)
            .map((entry) => entry[1]);
        let anu = groups.map((v) => v.id);
        let jackhuh = `All groups jid\n\n`;
        citel.reply(`Fetching jid from ${anu.length} Groups`);
        for (let i of anu) {
            let metadata = await Void.groupMetadata(i);
            await sleep(500);
            jackhuh += `*Subject:-* ${metadata.subject}\n`;
            jackhuh += `*Member :* ${metadata.participants.length}\n`;
            jackhuh += `*Jid:-* ${i}\n\n`;
        }
        citel.reply(jackhuh);
    },
);
