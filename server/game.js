import { WebSocketServer } from "ws";
import { sendGameState, checkWinner } from "./func.js";

const wss = new WebSocketServer({ port: 3001 });
const games = new Map();
const BOARD_SIZE = 3;

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    const message = JSON.parse(data);
    const game = games.get(message.gameId);
    console.log(message);

    switch (message.type) {
      case "join":
        if (!game) {
          games.set(message.gameId, {
            players: [ws],
            board: Array(BOARD_SIZE)
              .fill(null)
              .map(() => Array(BOARD_SIZE).fill(null)),
            currentPlayer: "X",
          });
          sendGameState(games.get(message.gameId), "waiting");
        } else {
          game.players.push(ws);
          sendGameState(games.get(message.gameId), "ready");
        }
        break;
      case "move":
        if (!game && game.players.length < 2) return;

        const playerIndex = game.players.indexOf(ws);
        const isXPlayer = playerIndex === 0;
        const isOPlayer = playerIndex === 1;

        if (
          (game.currentPlayer === "X" && isXPlayer) ||
          (game.currentPlayer === "O" && isOPlayer)
        ) {
          const [index1, index2] = message.cellIndex;

          if (game.board[index1][index2] === null) {
            game.board[index1][index2] = game.currentPlayer;
            game.currentPlayer = game.currentPlayer === "X" ? "O" : "X";
            sendGameState(game, "move");
            const winner = checkWinner(game.board);
            if (winner) {
              sendGameState(game, "win");
            }
          }
        }
        break;
      default:
        break;
    }
  });
});
