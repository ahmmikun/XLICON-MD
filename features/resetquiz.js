const { cmd, ui } = require('../lib');
const quiz = require('../lib/shared/quiz');

cmd(
    {
        pattern: 'resetquiz',
        desc: 'Reset and delete the quiz game',
        category: 'game',
        filename: __filename,
    },
    async (Void, citel) => {
        if (!quiz.state.active) return citel.reply(ui.info('No quiz is currently running.'));
        quiz.reset();
        return citel.reply(ui.ok(`Quiz reset. Start a new one with ${ui.prefix}beginquiz.`));
    },
);
