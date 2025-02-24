"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import styles from "./game.module.css";
import { Board, ButtonRefs, gameState } from "./types";
import { useSearchParams, useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

const BOARD_SIZE = 3;

function Game() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const wsRef = useRef<WebSocket | null>(null);
  const [gameId, setGameId] = useState<String | null>(null);
  const [gameState, setGameState] = useState<gameState>({
    board: Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(null)),
    status: "connect",
    currentPlayer: "X",
  });
  const [isWaiting, setIsWaiting] = useState<Boolean>(true);
  const [winner, setWinner] = useState<String | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const newGameId = params.get("id") || uuidv4();

    if (!params.get("id")) {
      params.set("id", newGameId);
      router.replace(`?${params.toString()}`);
      console.log(`Игра ${newGameId} инициализирована`);
    }

    setGameId(newGameId);
  }, [searchParams, router]);

  useEffect(() => {
    if (!gameId) return;

    const ws = new WebSocket(
      process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001"
    );
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Websocket соединение установлено");
      ws.send(
        JSON.stringify({
          type: "join",
          gameId,
          gameState,
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data.status);

      switch (data.status) {
        case "ready":
          setIsWaiting(false);
          break;
        case "move":
          setGameState({
            board: data.board,
            status: data.status,
            currentPlayer: data.currentPlayer,
          });
          break;
        case "win":
          setWinner(data.currentPlayer);
          break;
      }
    };

    ws.onclose = () => {
      console.log("Соединение закрыто");
    };
  }, [gameId]);

  function handleCellCLick(index1: number, index2: number) {
    if (wsRef.current) {
      wsRef.current.send(
        JSON.stringify({ type: "move", cellIndex: [index1, index2], gameId })
      );
    }
  }

  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      {winner ? <h1>Player {winner} are win !</h1> : null}
      {isWaiting ? (
        <div>Ожидание второго игрока</div>
      ) : (
        <main className={styles.main}>
          <div
            className={styles.grid}
            style={{
              gridTemplateColumns: `repeat(${BOARD_SIZE}, 100px)`,
              gridTemplateRows: `repeat(${BOARD_SIZE}, 100px)`,
            }}
          >
            {gameState.board.map((row, index1) =>
              row.map((cell, index2) => {
                return (
                  <button
                    key={`${index1}-${index2}`}
                    className={styles.cell}
                    onClick={() => {
                      handleCellCLick(index1, index2);
                    }}
                  >
                    {cell}
                  </button>
                );
              })
            )}
          </div>
        </main>
      )}
    </Suspense>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <Game />
    </Suspense>
  );
}
