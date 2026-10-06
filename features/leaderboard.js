const { sck1, cmd } = require('../lib');
const Levels = require('discord-xp');
cmd(
    {
        pattern: 'leaderboard',
        alias: ['deck'],
        desc: 'To check leaderboard',
        category: 'general',
        filename: __filename,
    },
    async (Void, citel) => {
        const fetchlb = await Levels.fetchLeaderboard('RandomXP', 5);
        let leadtext = `
*-------------------------------*
*----● LeaderBoard ● -----*
*-------------------------------*
\n\n`;
        for (let i = 0; i < fetchlb.length; i++) {
            const lvpoints = fetchlb[i].level;
            var role = 'GOD✨';
            if (lvpoints <= 2) {
                var role = '🏳Citizen';
            } else if (lvpoints <= 4) {
                var role = '🌟 Rookie Knight';
            } else if (lvpoints <= 6) {
                var role = '🌟 Knight';
            } else if (lvpoints <= 8) {
                var role = '🌟 Captain Knight';
            } else if (lvpoints <= 10) {
                var role = '🌀 Baby Wizard';
            } else if (lvpoints <= 12) {
                var role = '🌀 Wizard';
            } else if (lvpoints <= 14) {
                var role = '🌀 Wizard King';
            } else if (lvpoints <= 16) {
                var role = '💧 Baby Mage';
            } else if (lvpoints <= 18) {
                var role = '💧 Mage';
            } else if (lvpoints <= 20) {
                var role = '💧 Master Of Mage';
            } else if (lvpoints <= 22) {
                var role = '❄ Child Of Nobel';
            } else if (lvpoints <= 24) {
                var role = '❄ Nobel';
            } else if (lvpoints <= 26) {
                var role = '❄ Master Of Nobel';
            } else if (lvpoints <= 28) {
                var role = '☇ Child Of Speed';
            } else if (lvpoints <= 30) {
                var role = '☇ Dominator Speed';
            } else if (lvpoints <= 32) {
                var role = '☇ God Of Speed';
            } else if (lvpoints <= 34) {
                var role = '🌬 Baby Light';
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
                var role = '🎭 Nearly Devil';
            } else if (lvpoints <= 55) {
                var role = '🔥Immortal Devil X';
            }
            let data = await sck1.findOne({
                id: fetchlb[i].userID,
            });
            let namew = fetchlb[i].userID;
            let ttms = fetchlb[i].xp / 8;
            leadtext += `*${i + 1}●Name*: ${data.name}\n*●Level*: ${fetchlb[i].level}\n*●Points*: ${fetchlb[i].xp}\n*●Role*: ${role}\n*●Total messages*: ${ttms}\n\n`;
        }
        return citel.reply(leadtext);
    },
);
