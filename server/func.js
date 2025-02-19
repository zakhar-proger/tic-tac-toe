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
