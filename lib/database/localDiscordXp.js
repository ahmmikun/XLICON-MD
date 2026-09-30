const { JsonModel } = require('./jsonDb');

const levelsModel = new JsonModel('Levels', {
    userID: { type: String, required: true },
    guildID: { type: String, required: true },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: () => new Date() }
}, 'levels.json');

class LocalDiscordXp {
    static async setURL(dbUrl) {
        return Promise.resolve(true);
    }

    static async createUser(userId, guildId) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");

        const isUser = await levelsModel.findOne({ userID: userId, guildID: guildId });
        if (isUser) return false;

        const newUser = levelsModel.createDocument({
            userID: userId,
            guildID: guildId,
            xp: 0,
            level: 0
        });

        await newUser.save();
        return newUser;
    }

    static async deleteUser(userId, guildId) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");

        const user = await levelsModel.findOne({ userID: userId, guildID: guildId });
        if (!user) return false;

        await levelsModel.deleteOne({ userID: userId, guildID: guildId });
        return user;
    }

    static async appendXp(userId, guildId, xp) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (xp === 0 || !xp || isNaN(parseInt(xp))) throw new TypeError("An amount of xp was not provided/was invalid.");

        let user = await levelsModel.findOne({ userID: userId, guildID: guildId });

        if (!user) {
            const initialXp = parseInt(xp, 10);
            const initialLevel = Math.floor(0.1 * Math.sqrt(initialXp));
            const newUser = levelsModel.createDocument({
                userID: userId,
                guildID: guildId,
                xp: initialXp,
                level: initialLevel
            });

            await newUser.save();
            return initialLevel > 0;
        }

        const oldLevel = user.level;
        user.xp += parseInt(xp, 10);
        user.level = Math.floor(0.1 * Math.sqrt(user.xp));
        user.lastUpdated = new Date();

        await user.save();
        return user.level > oldLevel;
    }

    static async appendLevel(userId, guildId, levelss) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (!levelss) throw new TypeError("An amount of levels was not provided.");

        const user = await levelsModel.findOne({ userID: userId, guildID: guildId });
        if (!user) return false;

        user.level += parseInt(levelss, 10);
        user.xp = user.level * user.level * 100;
        user.lastUpdated = new Date();

        await user.save();
        return user;
    }

    static async setXp(userId, guildId, xp) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (xp === 0 || !xp || isNaN(parseInt(xp))) throw new TypeError("An amount of xp was not provided/was invalid.");

        const user = await levelsModel.findOne({ userID: userId, guildID: guildId });
        if (!user) return false;

        user.xp = parseInt(xp, 10);
        user.level = Math.floor(0.1 * Math.sqrt(user.xp));
        user.lastUpdated = new Date();

        await user.save();
        return user;
    }

    static async setLevel(userId, guildId, level) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (!level) throw new TypeError("A level was not provided.");

        const user = await levelsModel.findOne({ userID: userId, guildID: guildId });
        if (!user) return false;

        user.level = parseInt(level, 10);
        user.xp = user.level * user.level * 100;
        user.lastUpdated = new Date();

        await user.save();
        return user;
    }

    static async fetch(userId, guildId, fetchPosition = false) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");

        const user = await levelsModel.findOne({
            userID: userId,
            guildID: guildId
        });
        if (!user) return false;

        if (fetchPosition === true) {
            const leaderboard = await levelsModel.find({ guildID: guildId }).sort([['xp', 'descending']]).exec();
            user.position = leaderboard.findIndex(i => i.userID === userId) + 1;
        }

        user.cleanXp = user.xp - this.xpFor(user.level);
        user.cleanNextLevelXp = this.xpFor(user.level + 1) - this.xpFor(user.level);

        return user;
    }

    static async subtractXp(userId, guildId, xp) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (xp === 0 || !xp || isNaN(parseInt(xp))) throw new TypeError("An amount of xp was not provided/was invalid.");

        const user = await levelsModel.findOne({ userID: userId, guildID: guildId });
        if (!user) return false;

        user.xp -= parseInt(xp, 10);
        if (user.xp < 0) user.xp = 0;
        user.level = Math.floor(0.1 * Math.sqrt(user.xp));
        user.lastUpdated = new Date();

        await user.save();
        return user;
    }

    static async subtractLevel(userId, guildId, levelss) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (!levelss) throw new TypeError("An amount of levels was not provided.");

        const user = await levelsModel.findOne({ userID: userId, guildID: guildId });
        if (!user) return false;

        user.level -= parseInt(levelss, 10);
        if (user.level < 0) user.level = 0;
        user.xp = user.level * user.level * 100;
        user.lastUpdated = new Date();

        await user.save();
        return user;
    }

    static async fetchLeaderboard(guildId, limit) {
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (!limit) throw new TypeError("A limit was not provided.");

        const users = await levelsModel.find({ guildID: guildId }).sort([['xp', 'descending']]).exec();
        return users.slice(0, parseInt(limit, 10));
    }

    static async computeLeaderboard(client, leaderboard, fetchUsers = false) {
        if (!leaderboard) throw new TypeError("A leaderboard was not provided.");
        if (leaderboard.length < 1) return [];

        const computedArray = [];
        for (const key of leaderboard) {
            computedArray.push({
                guildID: key.guildID,
                userID: key.userID,
                xp: key.xp,
                level: key.level,
                position: (leaderboard.findIndex(i => i.guildID === key.guildID && i.userID === key.userID) + 1),
                username: "Unknown",
                discriminator: "0000"
            });
        }
        return computedArray;
    }

    static xpFor(targetLevel) {
        if (isNaN(targetLevel) || isNaN(parseInt(targetLevel, 10))) throw new TypeError("Target level should be a valid number.");
        targetLevel = parseInt(targetLevel, 10);
        if (targetLevel < 0) throw new RangeError("Target level should be a positive number.");
        return targetLevel * targetLevel * 100;
    }

    static async deleteGuild(guildId) {
        if (!guildId) throw new TypeError("A guild id was not provided.");
        await levelsModel.deleteMany({ guildID: guildId });
        return true;
    }
}

module.exports = LocalDiscordXp;
