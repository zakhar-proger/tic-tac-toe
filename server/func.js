import { v4 as uuidv4 } from "uuid";

export function sendGameState(game, status) {
  game.players.forEach((player) => {
    if (player.readyState === WebSocket.OPEN) {
      player.send(
        JSON.stringify({
          board: game.board,
          status,
          currentPlayer: game.currentPLayer,
        })
      );
    }
  });
}

export function checkWinner(board) {
  const lines = [
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [0, 2],
      [1, 1],
      [2, 0],
    ],
  ];

  for (let [a, b, c] of lines) {
    a = board[a[0]][a[1]];
    b = board[b[0]][b[1]];
    c = board[c[0]][c[1]];

    if (a && a === b && a === c) {
      return a;
    }
  }
}
