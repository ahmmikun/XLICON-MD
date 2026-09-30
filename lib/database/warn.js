const { createModel } = require('./adapter');

const BlockSchema = {
    id: { type: String, required: true },
    reason: { type: String, default: "No Reason" },
    date: { type: String, default: () => Date.now().toString() },
    group: { type: String, default: "In Private chat" },
    warnedby: { type: String, default: "false" }
};

const warndb = createModel("warndb", BlockSchema, "warn.json");

module.exports = { warndb };