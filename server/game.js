import { WebSocketServer } from "ws";
import { sendGameState } from "./func.js";

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
        break;
      default:
        break;
    }
  });
});
