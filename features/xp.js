const { cmd, Config } = require('../lib');
const Levels = require('discord-xp');

if (Config.WORKTYPE !== 'private') {
    cmd(
        {
            on: 'text',
        },
        async (Void, citel) => {
            await Levels.appendXp(citel.sender, 'RandomXP', 8);
        },
    );
}
