const { cmd } = require('../lib');
const eco = require('discord-mongoose-economy');
const { games, isRoom, board } = require('../lib/shared/tictactoe');

eco.connect(mongodb);

const MOVE = /^([1-9]|(me)?give_up|surr?ender|off|skip)$/i;
const ERRORS = { '-3': 'The game is over.', '-2': 'Invalid', '-1': '_Invalid Position_', 0: '_Invalid Position_' };

cmd(
    {
        on: 'text',
    },
    async (Void, citel) => {
        if (!citel.isGroup) return;
        const room = Object.values(games).find(
            (item) => isRoom(item) && item.state === 'PLAYING' && [item.game.playerX, item.game.playerO].includes(citel.sender),
        );
        if (!room || !MOVE.test(citel.text)) return;

        const game = room.game;
        const surrender = !/^[1-9]$/.test(citel.text);
        if (citel.sender !== game.currentTurn && !surrender) return;

        if (!surrender) {
            const result = game.turn(citel.sender === game.playerO, parseInt(citel.text) - 1);
            if (result < 1) return citel.reply(ERRORS[result]);
        }

        let won = citel.sender === game.winner;
        const tied = !won && game.board === 0x1ff;
        if (surrender) {
            game._currentTurn = citel.sender === game.playerX;
            won = true;
        }

        const winner = surrender ? game.currentTurn : game.winner;
        const status = won
            ? `@${winner.split('@')[0]} won and got 2000💎 in the wallet.`
            : tied
              ? 'Game tied. Well played, both of you.'
              : `Current turn ${['❌', '⭕'][Number(game._currentTurn)]} @${game.currentTurn.split('@')[0]}`;
        const caption = `Room ID: ${room.id}\n\n${board(game)}\n${status}\n⭕ @${game.playerO.split('@')[0]}\n❌ @${game.playerX.split('@')[0]}`;

        const side = game._currentTurn ^ surrender ? 'x' : 'o';
        if (room[side] !== citel.chat) room[side] = citel.chat;

        if (won) await eco.give(citel.sender, 'secktor', 2000);
        await Void.sendMessage(citel.chat, { text: caption, mentions: [game.playerO, game.playerX] });
        if (won || tied) delete games[room.id];
    },
);
