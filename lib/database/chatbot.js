const { createModel } = require('./adapter');

const ChatBotSchema = {
    id: { type: String, required: true, unique: true },
    worktype: { type: String, default: "false" }
};

const chatbot = createModel("chatbot", ChatBotSchema, "chatbot.json");

module.exports = { chatbot };