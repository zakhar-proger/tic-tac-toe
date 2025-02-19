export type Board = (string | null)[][];

export type ButtonRefs = { [key: string]: HTMLButtonElement | null };

export interface gameState {
  board: Board;
  status: string;
  currentPlayer: string;
}
