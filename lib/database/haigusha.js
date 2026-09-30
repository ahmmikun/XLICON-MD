const { createModel } = require('./adapter');

const HaiguSchema = {
    id: { type: String, required: true, unique: true },
    haig: { type: String, default: "false" }
};

const haigu = createModel("haigu", HaiguSchema, "haigusha.json");

module.exports = { haigu };