import { randomInteger } from "./utils/math";
import drawNextGrid from "./drawNextGrid";
import Creature from "./Creature";

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

  const creatures = [];

  const initialGrid = Array(arrayHeight)
    .fill(0)
    .map((_, rowIndex) =>
      Array(arrayWidth)
        .fill(0)
        .map((_, columnIndex) => {
          const rand = randomInteger(1, 10) > 9 ? 1 : 0;
          if (rand) {
            creatures.push(new Creature(rowIndex, columnIndex));
          }
          return rand;
        })
    );

  const flatGrid = initialGrid.flat();

  animateLoop({
    hue: randomInteger(0, 36),
    ctx,
    width,
    height,
    grid: flatGrid,
    squareSize,
    arrayHeight,
    arrayWidth
  });
})();
