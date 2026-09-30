const { JsonModel } = require('./jsonDb');

const dailycd = 8.64e+7; // 24 hours

const economyModel = new JsonModel('economy', {
    guildID: { type: String, default: "secktor" },
    userID: { type: String, required: true },
    wallet: { type: Number, default: 0 },
    bank: { type: Number, default: 0 },
    bankCapacity: { type: Number, default: 2500 },
    daily: { type: String, default: "0" }
}, 'economy.json');

module.exports = {
    async connect(uri) {
        return Promise.resolve(true);
    },

    async balance(userID, guildID) {
        if (!userID) throw new TypeError("Please Provide a User ID");
        if (!guildID) throw new TypeError("Please Provide a Guild ID");

        let user = await economyModel.findOne({ userID, guildID });
        if (!user) {
            user = economyModel.createDocument({
                guildID,
                userID,
                wallet: 0,
                bank: 0,
                bankCapacity: 2500,
                daily: "0"
            });
            await user.save();
        }

        return {
            wallet: user.wallet,
            bankCapacity: user.bankCapacity,
            bank: user.bank
        };
    },

    async give(userID, guildID, amount) {
        if (!userID) throw new TypeError("Please Provide a User ID");
        if (!guildID) throw new TypeError("Please Provide a Guild ID");
        if (!amount) throw new TypeError("Please Provide an Amount");
        if (isNaN(amount)) throw new TypeError("The amount should be an integer");
        if (amount < 0) throw new TypeError("Amount can't be less than zero");

        let user = await economyModel.findOne({ userID, guildID });
        if (!user) {
            user = economyModel.createDocument({
                guildID,
                userID,
                wallet: parseInt(amount, 10),
                bank: 0,
                bankCapacity: 2500
            });
            await user.save();
            return { amount: parseInt(amount, 10) };
        }

        user.wallet += parseInt(amount, 10);
        await user.save();
        return { amount: parseInt(amount, 10) };
    },

    async deduct(userID, guildID, amount) {
        if (!userID) throw new TypeError("Please Provide a User ID");
        if (!guildID) throw new TypeError("Please Provide a Guild ID");
        if (amount === undefined || amount === null) throw new TypeError("Please Provide an Amount");
        if (isNaN(amount)) throw new TypeError("The amount should be an integer");
        if (amount < 0) throw new TypeError("Amount can't be less than zero");

        let user = await economyModel.findOne({ userID, guildID });
        if (!user) {
            user = economyModel.createDocument({
                guildID,
                userID,
                wallet: 0,
                bank: 0,
                bankCapacity: 2500
            });
            await user.save();
            return { amount: 0 };
        }

        if (amount > user.wallet) {
            user.wallet = 0;
            await user.save();
            return { amount: 0 };
        }

        user.wallet -= parseInt(amount, 10);
        await user.save();
        return { amount: parseInt(amount, 10) };
    },

    async giveCapacity(userID, guildID, capacity) {
        if (!userID) throw new TypeError("Please Provide a User ID");
        if (!guildID) throw new TypeError("Please Provide a Guild ID");
        if (!capacity) throw new TypeError("Please Provide an Amount");
        if (isNaN(capacity)) throw new TypeError("The amount should be an integer");
        if (capacity < 0) throw new TypeError("Can't give bank space less than zero");

        let user = await economyModel.findOne({ userID, guildID });
        if (!user) {
            user = economyModel.createDocument({
                guildID,
                userID,
                wallet: 0,
                bank: 0,
                bankCapacity: 2500 + parseInt(capacity, 10)
            });
            await user.save();
            return { capacity: parseInt(capacity, 10) };
        }

        user.bankCapacity += parseInt(capacity, 10);
        await user.save();
        return { capacity: parseInt(capacity, 10) };
    },

    async create(userID, guildID) {
        if (!userID) throw new TypeError("Please Provide a User ID");
        if (!guildID) throw new TypeError("Please Provide a Guild ID");

        const user = await economyModel.findOne({ userID, guildID });
        if (user) return { exists: true };

        const newU = economyModel.createDocument({
            guildID,
            userID,
            wallet: 0,
            bank: 0,
            bankCapacity: 2500
        });
        await newU.save();
        return { exists: false };
    },

    async delete(userID, guildID) {
        if (!userID) throw new TypeError("Please Provide a User ID");
        if (!guildID) throw new TypeError("Please Provide a Guild ID");

        const user = await economyModel.findOne({ userID, guildID });
        if (!user) return { exists: false };
        await economyModel.deleteOne({ userID, guildID });
        return { exists: true };
    },

    async lb(guildID, count, type) {
        if (!guildID) throw new TypeError("Please Provide a Guild ID");
        if (!count) throw new TypeError("You didn't Provide the amount of users");
        if (isNaN(count)) throw new TypeError("The Amount of Users must be a number");

        const users = await economyModel.find({ guildID }).sort([['wallet', 'descending']]).exec();
        return users.slice(0, parseInt(count, 10));
    },

    async daily(userID, guildID, amount) {
        if (!userID) throw new TypeError("Please Provide a User ID");
        if (!guildID) throw new TypeError("Please Provide a Guild ID");
        if (!amount) throw new TypeError("Please Provide an amount");

        let user = await economyModel.findOne({ userID, guildID });
        if (!user) {
            user = economyModel.createDocument({
                userID,
                guildID,
                wallet: 0,
                bank: 0,
                bankCapacity: 2500,
                daily: "0"
            });
            await user.save();
        }

        const lastDaily = parseInt(user.daily, 10) || 0;
        const diff = dailycd - (Date.now() - lastDaily);

        if (diff > 0) {
            const millisec = parseInt(diff, 10);
            const totalSeconds = Math.floor(millisec / 1000);
            let hours = Math.floor(totalSeconds / 3600);
            let minutes = Math.floor((totalSeconds % 3600) / 60);
            let seconds = totalSeconds % 60;

            const hoursStr = (hours >= 10 ? "" : "0") + hours;
            const minutesStr = (minutes >= 10 ? "" : "0") + minutes;
            const secondsStr = (seconds >= 10 ? "" : "0") + seconds;

            let cdL = `${hoursStr} Hour(s), ${minutesStr} Minute(s), ${secondsStr} Seconds.`;
            if (!hours) cdL = `${minutesStr} Minute(s), ${secondsStr} Seconds.`;
            if (!hours && !minutes) cdL = `${secondsStr} Seconds.`;

            return { cd: true, cdL, seconds: secondsStr, minutes: minutesStr, hours: hoursStr };
        } else {
            user.daily = String(Date.now());
            user.wallet += parseInt(amount, 10);
            await user.save();
            return { amount: parseInt(amount, 10) };
        }
    },

    async deposit(userID, guildID, amount) {
        if (!userID) throw new TypeError("Please Provide a User ID");
        if (!guildID) throw new TypeError("Please Provide a Guild ID");
        if (!amount) throw new TypeError("Please Provide an amount");
        if (amount !== "all" && isNaN(amount)) throw new TypeError("Please Provide an amount");
        if (amount !== "all" && parseInt(amount, 10) < 0) throw new TypeError("Deposit Can't be less Than Zero");

        let user = await economyModel.findOne({ userID, guildID });
        if (!user) {
            user = economyModel.createDocument({ userID, guildID, wallet: 0, bank: 0, bankCapacity: 2500 });
            await user.save();
        }

        const bankc = user.bankCapacity;
        if (amount !== "all" && parseInt(amount, 10) > user.wallet) {
            return { noten: true };
        }

        const space = bankc - user.bank;
        if (space <= 0) {
            return { noten: true };
        }

        let depositAmount;
        if (amount === "all") {
            depositAmount = Math.min(user.wallet, space);
        } else {
            depositAmount = Math.min(parseInt(amount, 10), space);
        }

        user.bank += depositAmount;
        user.wallet -= depositAmount;
        await user.save();

        return { noten: false, amount: depositAmount };
    },

    async withdraw(userID, guildID, wAmount) {
        if (!userID) throw new TypeError("Please Provide a User ID");
        if (!guildID) throw new TypeError("Please Provide a Guild ID");
        if (!wAmount) throw new TypeError("Please Provide an amount");
        if (wAmount !== "all" && isNaN(wAmount)) return { invalid: true };
        if (wAmount !== "all" && parseInt(wAmount, 10) < 0) throw new TypeError("Withdraw Can't be less Than Zero");

        let user = await economyModel.findOne({ userID, guildID });
        if (!user) {
            user = economyModel.createDocument({ userID, guildID, wallet: 0, bank: 0, bankCapacity: 2500 });
            await user.save();
        }

        if (wAmount !== "all" && parseInt(wAmount, 10) > user.bank) {
            return { noten: true };
        }

        if (wAmount === "all") {
            const all = user.bank;
            user.wallet += all;
            user.bank = 0;
            await user.save();
            return { amount: all };
        } else {
            const amount = parseInt(wAmount, 10);
            user.wallet += amount;
            user.bank -= amount;
            await user.save();
            return { amount };
        }
    }
};
