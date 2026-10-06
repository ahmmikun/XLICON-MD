const { cmd, getAdmin, ui } = require('../lib');
const { games, isRoom } = require('../lib/shared/tictactoe');

cmd(
    {
        pattern: 'delttt',
        desc: 'Deletes the running TicTacToe session',
        category: 'game',
        filename: __filename,
    },
    async (Void, citel, text, { isCreator }) => {
        if (!citel.isGroup) return citel.reply(ui.text.group);
        const admins = await getAdmin(Void, citel);
        if (!admins.includes(citel.sender) && !isCreator) return citel.reply(ui.text.admin);

        const rooms = Object.values(games).filter(isRoom);
        if (!rooms.length) return citel.reply(ui.info('No TicTacToe game is running.'));
        rooms.forEach((room) => delete games[room.id]);
        return citel.reply(ui.ok('Deleted the running TicTacToe game.'));
    },
);
