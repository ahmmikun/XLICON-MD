const { cmd } = require('../lib');
const todo = require('../lib/shared/todo');
cmd(
    {
        on: 'text',
        fromMe: false,
    },
    async (Void, citel, text) => {
        if (/(\baza\b|\bsend task\b|\brecordedtask\b)/i.test(text) && todo.task) {
            await citel.reply(todo.task);
        }
    },
);
