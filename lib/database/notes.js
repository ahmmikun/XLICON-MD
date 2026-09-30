const { createModel } = require('./adapter');

const NotesSchema = {
    id: { type: String, required: true, unique: true },
    note: { type: String, default: "false" }
};

const notes = createModel("notes", NotesSchema, "notes.json");

module.exports = { notes };