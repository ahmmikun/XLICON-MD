const { cmd, getBuffer, ui } = require('../lib');
const Levels = require('discord-xp');
cmd(
    {
        pattern: 'rank',
        desc: 'Sends rank card of user.',
        category: 'group',
        filename: __filename,
    },
    async (Void, citel, text) => {
        const userq = await Levels.fetch(citel.sender, 'RandomXP');
        const lvpoints = userq.level;
        var role = 'GOD✨';
        if (lvpoints <= 2) {
            var role = '🏳Citizen';
        } else if (lvpoints <= 4) {
            var role = '🌟 Rookie Knight';
        } else if (lvpoints <= 6) {
            var role = '🌟 Knight';
        } else if (lvpoints <= 8) {
            var role = '🌟Captain Knight';
        } else if (lvpoints <= 10) {
            var role = '🌀 Baby Wizard';
        } else if (lvpoints <= 12) {
            var role = '🌀  Wizard';
        } else if (lvpoints <= 14) {
            var role = '🌀 Wizard King';
        } else if (lvpoints <= 16) {
            var role = '💧Baby Mage';
        } else if (lvpoints <= 18) {
            var role = '💧 Mage';
        } else if (lvpoints <= 20) {
            var role = '💧 Master of Mage';
        } else if (lvpoints <= 22) {
            var role = '❄ Child Of Nobel';
        } else if (lvpoints <= 24) {
            var role = '❄ Nobel';
        } else if (lvpoints <= 26) {
            var role = '❄ Master Of Nobel';
        } else if (lvpoints <= 28) {
            var role = '☇ Baby Speed';
        } else if (lvpoints <= 30) {
            var role = '☇ Dominator Speed';
        } else if (lvpoints <= 32) {
            var role = '☇ God Of Speed';
        } else if (lvpoints <= 34) {
            var role = '🌬 Child Of Light';
        } else if (lvpoints <= 36) {
            var role = '🌬 Light';
        } else if (lvpoints <= 38) {
            var role = '🌬 God Of Light';
        } else if (lvpoints <= 40) {
            var role = '🌙 Legend X';
        } else if (lvpoints <= 42) {
            var role = '🎇 Angel';
        } else if (lvpoints <= 44) {
            var role = '🎇 Fallen Angel';
        } else if (lvpoints <= 46) {
            var role = '🎭 Nearly Devil!';
        } else if (lvpoints <= 55) {
            var role = '🔥Immortal Devil X';
        }
        let disc = citel.sender.substring(3, 7);
        let textr = '';
        textr += `*Hii ${ui.text.greet} ,🌟 ${citel.pushName}∆${disc}'s* Exp\n\n`;
        let ttms = `${userq.xp}` / 8;
        textr += `*🌟Role*: ${role}\n*🟢Exp*: ${userq.xp} / ${Levels.xpFor(userq.level + 1)}\n*🏡Level*: ${userq.level}\n*Total Messages:*- ${ttms}`;
        try {
            ppuser = await Void.profilePictureUrl(citel.sender, 'image');
        } catch {
            ppuser = THUMB_IMAGE;
        }
        Void.sendMessage(
            citel.chat,
            {
                image: await getBuffer(ppuser),
                caption: textr,
            },
            {
                quoted: citel,
            },
        );
    },
);
