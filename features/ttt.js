const { cmd, ui } = require('../lib');
const TicTacToe = require('../lib/ttt');
const { games, playing, board } = require('../lib/shared/tictactoe');

cmd(
    {
        pattern: 'ttt',
        desc: 'Play TicTacToe',
        category: 'game',
        filename: __filename,
    },
    async (Void, citel, text) => {
        if (!citel.isGroup) return citel.reply(ui.text.group);
        if (playing(citel.sender)) return citel.reply(ui.warn('A game is already going on.'));

        const waiting = Object.values(games).find((room) => room.state === 'WAITING' && (text ? room.name === text : true));
        if (waiting) {
            waiting.o = citel.chat;
            waiting.game.playerO = citel.sender || citel.mentionedJid[0];
            waiting.state = 'PLAYING';
            return Void.sendMessage(citel.chat, {
                text: `Current turn: @${waiting.game.currentTurn.split('@')[0]}\nRoom ID: ${waiting.id}\n${board(waiting.game)}`,
                mentions: [waiting.game.currentTurn],
            });
        }

        const room = {
            id: `tictactoe-${Date.now()}`,
            x: citel.chat,
            o: '',
            game: new TicTacToe(citel.sender, 'o'),
            state: 'WAITING',
        };
        if (text) room.name = text;
        games[room.id] = room;
        return citel.reply(ui.info(`Waiting for a player. Send ${ui.prefix}ttt to join this game.`));
    },
);
