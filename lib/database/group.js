const { createModel } = require('./adapter');

const GroupSchema = {
    id: { type: String, unique: true, required: true },
    events: { type: String, default: "false" },
    nsfw: { type: String, default: "false" },
    welcome: { type: String, default: "@pp *Hi,* @user \n*Welcome in* @gname \n*Member count* : @count th" },
    goodbye: { type: String, default: "@pp *Wowaimo guess we never meet again.*\nUser: @user" },
    botenable: { type: String, default: "true" },
    antilink: { type: String, default: "false" },
    economy: { type: String, default: "false" },
    mute: { type: String },
    unmute: { type: String }
};

const sck = createModel("Sck", GroupSchema, "group.json");

module.exports = { sck };
