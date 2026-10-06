const questions = [
    {
        question: 'What is the capital of romania?',
        options: ['A. London', 'B. Berlin', 'C. Bucharest'],
        answer: 'C',
    },
    {
        question: 'Which planet is known as the Red Planet?',
        options: ['A. Earth', 'B. Mars', 'C. Venus'],
        answer: 'B',
    },
    {
        question: "What's the capital of iceland",
        options: ['A. ice city', 'B. Reykjavik', 'C. Wales'],
        answer: 'B',
    },
    {
        question: 'What is the smallest prime number?',
        options: ['A. 1', 'B. 2', 'C. 3'],
        answer: 'B',
    },
    {
        question: 'What is The capital of Hungary?',
        options: ['A. Budapest', 'B. Huncity', 'C. Hungury'],
        answer: 'A',
    },
    {
        question: 'Which Anime/manga is Goku from',
        options: ['A. DRAGON Ball', 'B. Naruto', 'C. JJK'],
        answer: 'A',
    },
    {
        question: 'Group of Organs are called🔬',
        options: ['A.System', 'B. Cells', 'C. Organ'],
        answer: 'A',
    },
    {
        question: 'CAPITAL OF GERMANY?',
        options: ['A. London', 'B. Berlin', 'C. Paris'],
        answer: 'B',
    },
    {
        question: "What's the largest ocean on Earth?",
        options: ['A. Atlantic Ocean', 'B. Indian Ocean', 'C. Pacific Ocean'],
        answer: 'C',
    },
    {
        question: "Who wrote 'To Kill a Mockingbird'?",
        options: ['A. J.K. Rowling', 'B. Harper Lee', 'C. Stephen King'],
        answer: 'B',
    },
    {
        question: 'What is the chemical symbol for water?',
        options: ['A. Wo', 'B. Wa', 'C. H2O'],
        answer: 'C',
    },
    {
        question: "What's the tallest mammal?",
        options: ['A. Elephant', 'B. Giraffe', 'C. Rhino'],
        answer: 'B',
    },
    {
        question: 'Which country is known as the Land of the Rising Sun?',
        options: ['A. China', 'B. Japan', 'C. South Korea'],
        answer: 'B',
    },
    {
        question: 'Who painted the Mona Lisa?',
        options: ['A. Vincent van Gogh', 'B. Pablo Picasso', 'C. Leonardo da Vinci'],
        answer: 'C',
    },
    {
        question: "What's the chemical symbol for gold?",
        options: ['A. Au', 'B. Ag', 'C. Fe'],
        answer: 'A',
    },
    {
        question: 'Which mammal can fly?',
        options: ['A. Bat', 'B. Mouse', 'C. Rabbit'],
        answer: 'A',
    },
    {
        question: "What's the largest organ in the human body?",
        options: ['A. Liver', 'B. Brain', 'C. Skin'],
        answer: 'C',
    },
    {
        question: 'Who is credited with the invention of the telephone?',
        options: ['A. Thomas Edison', 'B. Alexander Graham Bell', 'C. Nikola Tesla'],
        answer: 'B',
    },
    {
        question: "What's the currency of Japan?",
        options: ['A. Yen', 'B. Dollar', 'C. Euro'],
        answer: 'A',
    },
    {
        question: "Who wrote 'Romeo and Juliet'?",
        options: ['A. William Shakespeare', 'B. Charles Dickens', 'C. Jane Austen'],
        answer: 'A',
    },
];

const state = { index: 0, score: 0, active: false, wrong: [] };

const reset = () => {
    state.index = 0;
    state.score = 0;
    state.active = false;
    state.wrong = [];
};

const next = (citel) => {
    const current = questions[state.index];
    if (current) return citel.reply(`${current.question}\n${current.options.join('\n')}`);
    const summary = `[Quiz] completed! Your score: ${state.score}/${questions.length}`;
    const wrong = state.wrong.length ? `\nIncorrect Answers:\n${state.wrong.join('\n')}` : '';
    reset();
    return citel.reply(summary + wrong);
};

module.exports = { questions, state, reset, next };
