const { createModel } = require('./adapter');

const UserSchema = {
    id: { type: String, required: true, unique: true },
    name: { type: String },
    bot: { type: Boolean },
    announcement: { type: String },
    permit: { type: String, default: "false" },
    afk: { type: String, default: "false" },
    afktime: { type: Number, default: 0 },
    times: { type: Number, default: 0 },
    ban: { type: String, default: "false" },
    haig: { type: String, default: "false" }
};

const sck1 = createModel("Sck1", UserSchema, "user.json");

module.exports = { sck1 };
