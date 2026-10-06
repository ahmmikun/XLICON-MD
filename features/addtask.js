const { cmd } = require('../lib');
const todo = require('../lib/shared/todo');
cmd(
    {
        pattern: 'addtask',
        desc: 'Add task to to-do list',
        fromMe: true,
        category: 'tools',
    },
    async (Void, citel, text) => {
        if (todo.task === '') {
            const message = text.trim();
            todo.task = message;
            await citel.reply(`Task recorded: "${message}"`);
        } else {
            await citel.reply('A task is already recorded.');
        }
    },
);
