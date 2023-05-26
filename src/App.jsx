import { useEffect } from "react";
import { useState } from "react";
import { get, isEqual, random } from "lodash";

function genMatrix(width, height) {
  return new Array(height).fill(new Array(width).fill(false));
}

const CELL_SIZE = 15;

export default function App() {
  const [isLooping, setIsLooping] = useState(false);
  const [matrixHeight, setMatrixHeight] = useState(
    Math.floor((window.visualViewport.height - 90) / CELL_SIZE)
  );
  const [matrixWidth, setMatrixWidth] = useState(
    Math.floor(window.visualViewport.width / CELL_SIZE)
  );
  const [matrix, setMatrix] = useState(genMatrix(matrixWidth, matrixHeight));

  window.onresize = () => {
    console.log("resize");
    setMatrixHeight(
      Math.floor((window.visualViewport.height - 90) / CELL_SIZE)
    );
    setMatrixWidth(Math.floor(window.visualViewport.width / CELL_SIZE));
  };

  useEffect(() => {
    setIsLooping(false);
    setMatrix(genMatrix(matrixWidth, matrixHeight));
  }, [matrixHeight, matrixWidth]);

  useEffect(() => {
    if (!isLooping) return;
    life();
  }, [isLooping, matrix]);

  function getMatrix(x, y) {
    const value = get(matrix, `${x}.${y}`, null);
    if (value !== null) return value;

    if (x < 0) x = matrix.length - 1;
    if (x >= matrix.length) x = 0;

    if (y < 0) y = matrix.length - 1;
    if (y >= matrix.length) y = 0;

    return matrix[x][y];
  }

  function life() {
    const newMatrix = matrix.map((row, x) => {
      return row.map((isLive, y) => {
        const neighboursCount = [
          getMatrix(x - 1, y - 1),
          getMatrix(x, y - 1),
          getMatrix(x + 1, y - 1),

          getMatrix(x - 1, y),
          getMatrix(x + 1, y),

          getMatrix(x - 1, y + 1),
          getMatrix(x, y + 1),
          getMatrix(x + 1, y + 1),
        ].filter((isLive) => isLive).length;

        return isLive
          ? !(neighboursCount < 2 || neighboursCount > 3)
          : neighboursCount === 3;
      });
    });

    if (!isEqual(matrix, newMatrix)) {
      setMatrix(newMatrix);
    }
  }

  function handleStart() {
    setIsLooping(!isLooping);
  }

  function handleReset() {
    setMatrix(genMatrix(matrixWidth, matrixHeight));
    setIsLooping(false);
  }

  function handleRandomize() {
    const ranodmizedMatrix = new Array(matrixHeight).fill().map(() => {
      return new Array(matrixWidth).fill(false).map(() => !random(0, 1));
    });

    setMatrix(ranodmizedMatrix);
  }

  function handleCellClick(x, y) {
    const newMatrix = matrix.map((row, rowX) => {
      return row.map((cell, cellY) => {
        if (x === rowX && cellY === y) return !cell;
        return cell;
      });
    });

    setMatrix(newMatrix);
  }

  return (
    <section>
      <header>
        <h2>Game of life</h2>
        <div className="buttons">
          <button onClick={handleStart}>{isLooping ? "⏸" : "▶️"}</button>
          <button onClick={handleReset}>{"🧹"}</button>
          <button onClick={handleRandomize}>{"👾"}</button>
        </div>
      </header>
      <main
        style={{
          gridTemplateColumns: `repeat(${matrixWidth}, ${CELL_SIZE - 1}px)`,
          gridTemplateRows: `repeat(${matrixHeight}, ${CELL_SIZE - 1}px)`,
        }}
      >
        {matrix.map((row, rowIndex) => {
          return row.map((isLive, cellIndex) => (
            <div
              key={`${rowIndex}-${cellIndex}`}
              className={`cell ${isLive ? "live" : "dead"}`}
              onClick={() => handleCellClick(rowIndex, cellIndex)}
            />
          ));
        })}
      </main>
    </section>
  );
}
