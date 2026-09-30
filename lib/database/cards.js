const { createModel } = require('./adapter');
const { haigu } = require('./haigusha');

const CardSchema = {
    id: { type: String, default: "secfork" },
    count: { type: String, default: "0" }
};

const card = createModel("card", CardSchema, "cards.json");

module.exports = { card, haigu };
