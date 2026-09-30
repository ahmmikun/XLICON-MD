const { createModel } = require('./adapter');

const fSchema = {
    level: { type: String, default: "false" }
};

const RandomXP = createModel("RandomXP", fSchema, "xp.json");

module.exports = { RandomXP };