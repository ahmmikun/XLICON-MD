const { cmd, botpic, Config } = require('../lib');
const Levels = require('discord-xp');
if (Config.WORKTYPE !== 'private') {
    cmd(
        {
            on: 'text',
        },
        async (Void, citel) => {
            const randomXp = 8;
            let usrname = citel.pushName;
            const hasLeveledUp = await Levels.appendXp(citel.sender, 'RandomXP', randomXp);
            if (hasLeveledUp) {
                const sck1 = await Levels.fetch(citel.sender, 'RandomXP');
                const lvpoints = sck1.level;
                var role = 'GOD';
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
                    var role = '☇ Child of Speed';
                } else if (lvpoints <= 30) {
                    var role = '☇ Dominator Speed';
                } else if (lvpoints <= 32) {
                    var role = '☇ God of Speed ';
                } else if (lvpoints <= 34) {
                    var role = '🌬 Child Of Light';
                } else if (lvpoints <= 36) {
                    var role = '🌬 Light';
                } else if (lvpoints <= 38) {
                    var role = '🌬 Master Of Light';
                } else if (lvpoints <= 40) {
                    var role = '🌙 Legend X';
                } else if (lvpoints <= 42) {
                    var role = '🎇 Angel';
                } else if (lvpoints <= 44) {
                    var role = '🎇 Fallen Angel X';
                } else if (lvpoints <= 46) {
                    var role = '🎭 Nearly Devil';
                } else if (lvpoints <= 55) {
                    var role = '🔥Immortal Devil X';
                } else {
                    var role = 'Kiddo';
                }
                if (Config.levelupmessage !== 'false') {
                    await Void.sendMessage(
                        citel.chat,
                        {
                            image: {
                                url: await botpic(),
                            },
                            caption: `
╔
║ *Wow,Someone just*
║ *leveled Up huh🔥*
║ *👤Name*: ${citel.pushName}
║ *⚡Level*: ${sck1.level}🌀
║ *💫Exp*: ${sck1.xp} / ${Levels.xpFor(sck1.level + 1)}
║ *📍Role*: *${role}*
║ *Enjoy🥳*
╚
`,
                        },
                        {
                            quoted: citel,
                        },
                    );
                }
            }
        },
    );
}
