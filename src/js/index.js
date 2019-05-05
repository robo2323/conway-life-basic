import { randomInteger } from "./utils/math";
import drawNextGrid from "./drawNextGrid";

const animateLoop = (props) => {
  const grid = drawNextGrid(props);

  window.requestAnimationFrame(() => animateLoop({ ...props, grid }));
};

(() => {
  const canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");

  const width = 1600,
    height = 800,
    squareSize = 4;

  canvas.width = width;
  canvas.height = height;

  const arrayHeight = height / squareSize;
  const arrayWidth = width / squareSize;

  const initialGrid = Array(arrayHeight)
    .fill(0)
    .map(() =>
      Array(arrayWidth)
        .fill(0)
        .map(() => (randomInteger(1, 10) > 4 ? 1 : 0))
    );

  animateLoop({
    hue: randomInteger(0, 36),
    ctx,
    width,
    height,
    grid: initialGrid.flat(),
    squareSize,
    arrayHeight,
    arrayWidth
  });
})();
