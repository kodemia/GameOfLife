import { useState } from "react";
import Cell from "./components/Cell";

function App() {
  const [matrix, setMatrix] = useState(
    new Array(50).fill(new Array(50).fill(false))
  );
  const [isLooping, setIsLooping] = useState(false);

  function lifeCalculus() {
    console.log("lifeCalc");
    const newMatrix = matrix.map((row, x) => {
      return row.map((state, y) => {
        const neighboursCount = [
          matrix[x - 1][y - 1] ?? false,
          matrix[x][y - 1] ?? false,
          matrix[x + 1][y - 1] ?? false,

          matrix[x - 1][y] ?? false,
          matrix[x + 1][y] ?? false,

          matrix[x - 1][y + 1] ?? false,
          matrix[x][y + 1] ?? false,
          matrix[x + 1][y + 1] ?? false,
        ].filter((neighbour) => neighbour).length;
        if (state === true) {
          if (neighboursCount < 2 || neighboursCount > 3) {
            return false;
          }
        } else {
          if (neighboursCount === 3) {
            return true;
          }
        }
      });
    });

    setMatrix(newMatrix);
  }

  function handleClick() {
    setIsLooping(!isLooping);
  }

  function handleCellClick(x, y) {
    console.log("click cell: ", x, y, matrix[x][y]);
    const newMatrix = matrix.map((row, rowX) => {
      return row.map((cell, cellY) => {
        if (x === rowX && cellY === y) return !cell;
        return cell;
      });
    });

    console.log("newMatrix", newMatrix);
    setMatrix(newMatrix);
  }

  if (isLooping) lifeCalculus();

  return (
    <section style={{ margin: "5px" }}>
      <button onClick={handleClick}>Iniciar</button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(50, 17px)",
          gridTemplateRows: "repeat(50, 17px)",
        }}
      >
        {matrix.map((row, rowIndex) => {
          return row.map((state, cellIndex) => (
            <Cell
              key={`${rowIndex}-${cellIndex}`}
              state={state}
              onClick={() => handleCellClick(rowIndex, cellIndex)}
            />
          ));
        })}
      </div>
    </section>
  );
}

export default App;

/*
    if (cell === "live") {
      if (neighboursCount < 2 || neighboursCount > 3) {
        cell.enterState("dead", cell.x, cell.y);
      }
    } else {
      if (neighboursCount === 3) {
        cell.enterState("live", cell.x, cell.y);
      }
    }
*/

/**
 * [-x,-y] [x,-y] [+x,-y]
 * [-x,y ] [x,y] [+x,y]
 * [-x,+y] [x,+y] [+x,+y]
 */
