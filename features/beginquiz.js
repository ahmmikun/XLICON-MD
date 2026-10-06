const { cmd, ui } = require('../lib');
const quiz = require('../lib/shared/quiz');

cmd(
    {
        pattern: 'beginquiz',
        desc: 'Begin a quiz game',
        category: 'game',
        filename: __filename,
    },
    async (Void, citel) => {
        if (quiz.state.active) return citel.reply(ui.warn(`The quiz is already running. Use ${ui.prefix}resetquiz to stop it.`));
        quiz.reset();
        quiz.state.active = true;
        return quiz.next(citel);
    },
);
