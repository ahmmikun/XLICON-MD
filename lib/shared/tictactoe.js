const games = {};

const symbols = {
    X: '❌',
    O: '⭕',
    1: '1️⃣',
    2: '2️⃣',
    3: '3️⃣',
    4: '4️⃣',
    5: '5️⃣',
    6: '6️⃣',
    7: '7️⃣',
    8: '8️⃣',
    9: '9️⃣',
};

const isRoom = (room) => room.id && room.game && room.state && room.id.startsWith('tictactoe');

const playing = (sender) =>
    Object.values(games).find((room) => isRoom(room) && [room.game.playerX, room.game.playerO].includes(sender));

const board = (game) => {
    const cells = game.render().map((cell) => symbols[cell]);
    return [cells.slice(0, 3), cells.slice(3, 6), cells.slice(6)].map((row) => row.join('  ')).join('\n');
};

module.exports = { games, isRoom, playing, board };
