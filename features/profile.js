const { cmd, botpic, ui } = require('../lib');
const Levels = require('discord-xp');
const moment = require('moment-timezone');
cmd(
    {
        pattern: 'profile',
        desc: 'Shows profile of user.',
        category: 'group',
        filename: __filename,
    },
    async (Void, citel, text) => {
        var bio = await Void.fetchStatus(citel.sender);
        var bioo = bio.status;
        let meh = citel.sender;
        const userq = await Levels.fetch(citel.sender, 'RandomXP');
        const lvpoints = userq.level;
        var role = 'GOD✨';
        if (lvpoints <= 2) {
            var role = '🏳Citizen';
        } else if (lvpoints <= 4) {
            var role = '🌟Rookie knight';
        } else if (lvpoints <= 6) {
            var role = '🌟knight';
        } else if (lvpoints <= 8) {
            var role = '🧙‍🌟Captain Knight';
        } else if (lvpoints <= 10) {
            var role = '🌀Baby Wizard';
        } else if (lvpoints <= 12) {
            var role = '🌀Wizard';
        } else if (lvpoints <= 14) {
            var role = '🌀Wizard King';
        } else if (lvpoints <= 16) {
            var role = '❄Baby Mage';
        } else if (lvpoints <= 18) {
            var role = '❄Mage';
        } else if (lvpoints <= 20) {
            var role = '❄Master of Mage';
        } else if (lvpoints <= 22) {
            var role = '🌊Child of Nobel';
        } else if (lvpoints <= 24) {
            var role = '🌊Nobel';
        } else if (lvpoints <= 26) {
            var role = '🌊Master of Nobel';
        } else if (lvpoints <= 28) {
            var role = '☇Child of Speed';
        } else if (lvpoints <= 30) {
            var role = '☇Dominator Speed';
        } else if (lvpoints <= 32) {
            var role = '☇God of Speed';
        } else if (lvpoints <= 34) {
            var role = '🌬 Child of Light';
        } else if (lvpoints <= 36) {
            var role = '🌬 Light';
        } else if (lvpoints <= 38) {
            var role = '🌬 God of Light';
        } else if (lvpoints <= 40) {
            var role = ' 🌙 Legend X';
        } else if (lvpoints <= 42) {
            var role = '🎇 Angel ';
        } else if (lvpoints <= 44) {
            var role = '🎇 Fallen Angel';
        } else if (lvpoints <= 46) {
            var role = '🎭 Nearly Devil ';
        } else if (lvpoints <= 55) {
            var role = '🔥 Immortal Devil X ';
        }
        let ttms = `${userq.xp}` / 8;
        const timenow = moment(moment()).format('HH:mm:ss');
        moment.tz.setDefault('Asia/Kolakata').locale('id');
        try {
            pfp = await Void.profilePictureUrl(citel.sender, 'image');
        } catch (e) {
            pfp = await botpic();
        }
        const profile = `
*Hii ${citel.pushName},*
*Here is your profile information*
*👤Username:* ${citel.pushName}
*⚡Bio:* ${bioo}
*🧩Role:* ${role}
*🍁Level:* ${userq.level}
*📥 Total Messages* ${ttms}
*Powered by King-Md*
`;
        let buttonMessage = {
            image: {
                url: pfp,
            },
            caption: profile,
            footer: ui.text.footer,
            headerType: 4,
        };
        Void.sendMessage(citel.chat, buttonMessage, {
            quoted: citel,
        });
    },
);
