const { cmd } = require('../lib');
const quiz = require('../lib/shared/quiz');

cmd(
    {
        on: 'text',
    },
    async (Void, citel) => {
        const current = quiz.questions[quiz.state.index];
        if (!current || !quiz.state.active) return;
        const answer = (citel.text || '').trim().toUpperCase();
        if (!['A', 'B', 'C'].includes(answer)) return;
        if (answer === current.answer) quiz.state.score++;
        else quiz.state.wrong.push(`${current.question} (Your Answer: ${answer}, Correct Answer: ${current.answer})`);
        quiz.state.index++;
        return quiz.next(citel);
    },
);
