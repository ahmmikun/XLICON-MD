const { createModel } = require('./adapter');

const SettingsSchema = {
    id: { type: String, required: true, unique: true },
    pmblock: { type: String, default: "false" },
    bgm: { type: String, default: "false" }
};

const botSettings = createModel("BotSettings", SettingsSchema, "bot_settings.json");

module.exports = { botSettings };
