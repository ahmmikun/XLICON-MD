const { createModel } = require('./adapter');

const pluginSchema = {
    id: { type: String, unique: true, required: true },
    url: { type: String }
};

const plugindb = createModel("Plugindb", pluginSchema, "plugins.json");

module.exports = { plugindb };