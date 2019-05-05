export default (() => {
  let cache = [];

  return ({ hue, ctx, squareSize, grid, arrayWidth, arrayHeight }) => {
    const nextGrid = grid.map((value, index) =>
      generate({
        index,
        value,
        hue,
        ctx,
        squareSize,
        grid,
        arrayWidth,
        arrayHeight,
        cache
      })
    );
    cache = grid;
    return nextGrid;
  };
})();

const generate = ({
  index,
  value,
  hue,
  ctx,
  squareSize,
  grid,
  arrayWidth,
  arrayHeight,
  cache
}) => {
  const rowIndex = Math.floor((index / arrayWidth) % arrayHeight);
  const columnIndex = index % arrayWidth;

  // update canvas with current grid
  if (value !== cache[index]) {
    ctx.fillStyle = value
      ? `hsla(${-value * hue}, ${value * 10}%, 50%)`
      : "#333";
    ctx.fillRect(
      columnIndex * squareSize,
      rowIndex * squareSize,
      squareSize,
      squareSize
    );
  }

  let neighbors = 0;
  // const rowCount = grid.length;
  // const columnCount = row.length;

  // const wrappedVertical = rowIndex === 0 ? grid[rowCount - 1] : grid[0];

  for (let i = -1; i <= 1; i++) {
    //const tempRow = grid[rowIndex + i] || wrappedVertical;

    // const wrappedHorizontal =
    //   columnIndex === 0 ? tempRow[columnCount - 1] : tempRow[0];

    for (let j = -1; j <= 1; j++) {
      const newValue = grid[(rowIndex + i) * arrayWidth + columnIndex + j] || 0;

      neighbors += newValue > 1 ? 1 : newValue;
    }
  }

  neighbors -= value > 1 ? 1 : value;
  if (value === 0 && neighbors === 3) {
    return 10;
  }

  if (value >= 1 && (neighbors > 3 || neighbors < 2)) {
    return 0;
  }
  const nextValue = value > 1 ? value - 1 : value;
  return nextValue;
};
