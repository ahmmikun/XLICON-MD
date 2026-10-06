const { sck, cmd, getAdmin, ui } = require('../lib');
cmd(
    {
        pattern: 'group',
        desc: 'mute and unmute group.',
        category: 'group',
        filename: __filename,
    },
    async (Void, citel, text) => {
        if (!citel.isGroup) return citel.reply(ui.text.group);
        const groupAdmins = await getAdmin(Void, citel);
        const botNumber = await Void.decodeJid(Void.user.id);
        const isBotAdmins = citel.isGroup ? groupAdmins.includes(botNumber) : false;
        const isAdmins = citel.isGroup ? groupAdmins.includes(citel.sender) : false;
        if (!isBotAdmins) return citel.reply(ui.text.botAdmin);
        if (!isAdmins) return citel.reply(ui.text.admin);
        let Group = await sck.findOne({
            id: citel.chat,
        });
        if (text.split(' ')[0] == 'close' || text.split(' ')[0] == 'mute') {
            await Void.groupSettingUpdate(citel.chat, 'announcement')
                .then((res) => citel.reply(`Group Chat Muted`))
                .catch((err) => citel.reply('Error :' + err));
        } else if (text.split(' ')[0] === 'open' || text.split(' ')[0] === 'unmute') {
            await Void.groupSettingUpdate(citel.chat, 'not_announcement')
                .then((res) => citel.reply(`Group Chat Unmuted`))
                .catch((err) => citel.reply('Error : ' + err));
        } else if (text == 'Detail' || text == 'Info' || text == 'info' || text == 'details') {
            const pp = (await Void.profilePictureUrl(citel.chat, 'image').catch((_) => null)) || '';
            const groupAdmins = participants.filter((p) => p.admin);
            const listAdmin = groupAdmins.map((v, i) => `  ${i + 1}. wa.me/${v.id.split('@')[0]}`).join('\n');
            const owner =
                groupMetadata.owner ||
                groupAdmins.find((p) => p.admin === 'superadmin')?.id ||
                citel.chat.split`-`[0] + '@s.whatsapp.net';
            let ginfos = `
      *「 INFO GROUP 」*
*▢ ID :*
   • ${groupMetadata.id}
*▢ NAME :* 
   • ${groupMetadata.subject}
*▢ Members :*
   • ${participants.length}
*▢ Group Owner :*
   • wa.me/${owner.split('@')[0]}
*▢ Admins :*
${listAdmin}
*▢ Description :*
   • ${groupMetadata.desc?.toString() || 'unknown'}
*▢ 🪢 Extra Group Configuration :*";
  • Group Nsfw :    ${Group.nsfw == 'true' ? '✅' : '❎'} 
  • Antilink        :    ${Group.antilink == 'true' ? '✅' : '❎'}
  • Economy      :    ${Group.economy == 'true' ? '✅' : '❎'}
  • Events         :     ${Group.events == 'true' ? '✅' : '❎'}
`.trim();
            if (Group.events == 'true') {
                ginfos += '\n*▢ Wellcome Message :* \n  • ' + Group.welcome;
                ginfos += '\n\n*▢ Goodbye Message :* \n  • ' + Group.goodbye;
            }
            return await Void.sendMessage(
                citel.chat,
                {
                    image: {
                        url: pp,
                    },
                    caption: ginfos,
                },
                {
                    quoted: citel,
                },
            );
        } else {
            return await citel.send(`*_Uhh Dear Give me Query From Bellow Options_*
_1:- .group Mute_
_2:- .group Unmute_
_3:- .group Info_
`);
        }
    },
);
