const { cmd } = require('../lib');
const todo = require('../lib/shared/todo');
cmd(
    {
        pattern: 'deltask',
        desc: 'Delete the recorded task',
        category: 'tools',
        fromme: true,
    },
    async (Void, citel) => {
        todo.task = '';
        await citel.reply('Task expected to be completed and deleted.');
    },
);
