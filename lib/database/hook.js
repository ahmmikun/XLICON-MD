const Module = require('module');
const originalRequire = Module.prototype.require;

const localDiscordXp = require('./localDiscordXp');
const localEconomy = require('./localEconomy');

let isHooked = false;

function setupRequireHook() {
    if (isHooked) return;
    isHooked = true;

    Module.prototype.require = function(id) {
        if (id === 'discord-xp' && !global.isMongodb) {
            return localDiscordXp;
        }
        if (id === 'discord-mongoose-economy' && !global.isMongodb) {
            return localEconomy;
        }
        if (id === 'performance-now') {
            try {
                return originalRequire.apply(this, arguments);
            } catch {
                return () => performance.now();
            }
        }
        return originalRequire.apply(this, arguments);
    };
}

setupRequireHook();

module.exports = {
    setupRequireHook,
    localDiscordXp,
    localEconomy
};
