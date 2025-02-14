"use client";

import { useState, useRef } from "react";
import styles from "./game.module.css";
import { Grid, ButtonRefs } from "./types";

const CELL_COUNT = 3;

export default function Game() {
  const [grid, setGrid] = useState<Grid>(
    Array(CELL_COUNT)
      .fill(null)
      .map(() => Array(CELL_COUNT).fill(null))
  ); // Сетка

  const buttonRefs = useRef<ButtonRefs>({});

  const handleCellClick = (index1: number, index2: number) => {
    let newGrid = [...grid];
    newGrid[index1][index2] = "X";
    setGrid(newGrid);

    const buttonKey = `${index1}-${index2}`;
    const button = buttonRefs.current[buttonKey];

    if (button) {
      button.value = "X";
    }
  };

  return (
    <main className={styles.main}>
      <div
        className={styles.grid}
        style={{
          gridTemplateColumns: `repeat(${CELL_COUNT}, 100px)`,
          gridTemplateRows: `repeat(${CELL_COUNT}, 100px)`,
        }}
      >
        {grid.map((row, index1) =>
          row.map((cell, index2) => {
            const buttonKey = `${index1}-${index2}`;
            return (
              <button
                key={buttonKey}
                ref={(el) => {
                  buttonRefs.current[buttonKey] = el;
                }}
                className={styles.cell}
                onClick={() => handleCellClick(index1, index2)}
              >
                {cell}
              </button>
            );
          })
        )}
      </div>
    </main>
  );
}
