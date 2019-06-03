export default (() => {
  let cache = [];
  const neighbors = [];
  let nextGrid = [];
  // const nextRow = [];

  return ({ hue, ctx, offscreenCtx, squareSize, grid }) => {
    // nextGrid.length = 0;
    // for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
    //   nextRow.length = 0;
    //   for (let columnIndex = 0; columnIndex < grid[0].length; columnIndex++) {
    //     nextRow.push(
    //       generate({
    //         rowIndex,
    //         columnIndex,
    //         value: grid[rowIndex][columnIndex],
    //         hue,
    //         ctx,
    //         offscreenCtx,
    //         squareSize,
    //         grid,
    //         cache,
    //         neighbors,
    //         row: grid[rowIndex]
    //       })
    //     );
    //   }

    //   nextGrid.push(nextRow);
    // }

     nextGrid = grid.map((row, rowIndex) =>
      row.map((value, columnIndex) =>
        generate({
          rowIndex,
          columnIndex,
          value,
          hue,
          ctx,
          offscreenCtx,
          squareSize,
          grid,
          cache,
          neighbors,
          row
        })
      )
    );

    cache = grid;
    return nextGrid;
  };
})();

const generate = ({
  rowIndex,
  columnIndex,
  value,
  hue,
  offscreenCtx,
  squareSize,
  grid,
  cache,
  neighbors,
  row
}) => {
  // const rowIndex = Math.floor((index / arrayWidth) % arrayHeight);
  // const columnIndex = index % arrayWidth;
  const cachedRow = cache[rowIndex];
  const cached = typeof cachedRow === "object" ? cachedRow[columnIndex] : false;
  // update canvas with current grid
  if (value !== cached) {
    const style = value ? `hsla(${value * 2 * hue}, 100%, 60%)` : "#333";
    offscreenCtx.fillStyle = style;
    offscreenCtx.fillRect(
      columnIndex * squareSize,
      rowIndex * squareSize,
      squareSize,
      squareSize
    );
    // offscreenCtx.strokeStyle = "#000"//style;
    // offscreenCtx.strokeRect(
    //   columnIndex * squareSize,
    //   rowIndex * squareSize,
    //   squareSize,
    //   squareSize
    // );
  }

  neighbors.length = 0;
  let neighborsCount = 0;
  const rowCount = grid.length;
  const columnCount = row.length;

  const wrappedRowIndex = rowIndex === 0 ? rowCount - 1 : 0;
  const wrappedColumIndex = columnIndex === 0 ? columnCount - 1 : 0;

  for (let i = -1; i <= 1; i++) {
    const tempRow = grid[rowIndex + i] || grid[wrappedRowIndex];

    for (let j = -1; j <= 1; j++) {
      let newValue;
      if (i === 0 && j === 0) {
        newValue = 0;
      } else {
        const tempValue = tempRow[columnIndex + j];
        newValue =
          typeof tempValue === "number"
            ? tempValue
            : tempRow[wrappedColumIndex];
      }

      newValue > 0 && neighbors.push(newValue);
      neighborsCount += newValue > 0 ? 1 : 0;
    }
  }

  if (
    value === 0 &&
    neighborsCount === 3 //||
    // neighborsCount === 5
    // neighborsCount === 5 ||
    // neighborsCount === 7
  ) {
    const neighborsTotal = neighbors.reduce((acc, currVal) => acc + currVal);
    return Math.round(neighborsTotal / neighbors.length);
    // return 10
  }

  if (value > 0 && (neighborsCount < 2 || neighborsCount > 3)) {
    return 0;
  }
  return value; // > 1 ? value - 1 : value;
};
