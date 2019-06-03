import _ from "lodash";
import { randomInteger } from "./utils/math";
import drawNextGrid from "./drawNextGrid";

(() => {
  //TODO: set width and height from current window size
  const width = 1800;
  const height = 800;
  const squareSize = 4; //TODO:view

  let speed = 0; //TODO:view

  const canvas = document.getElementById("canvas");

  canvas.width = width;
  canvas.height = height;
  const ctx = ""; //canvas.getContext("2d");
  const offscreenCanvas = canvas.transferControlToOffscreen();
  const offscreenCtx = offscreenCanvas.getContext("2d");

  const runButton = document.getElementById("run");

  const arrayHeight = height / squareSize; //TODO:view
  const arrayWidth = width / squareSize; //TODO:view
  let mousePos;
  let running = true; //TODO:view

  // canvas.addEventListener("mousemove", (e) => setMousePos(e, canvas), false);
  canvas.addEventListener("click", (e) => setMousePos(e, canvas), false);
  runButton.addEventListener(
    "click",
    () => {
      running = !running;
      runButton.innerText = running ? "Pause Simulation" : "Restart Simulation";
    },
    false
  );

  const initialGrid = Array(arrayHeight) //TODO:view
    .fill(0)
    .map(
      () =>
        new Int8Array(
          Array(arrayWidth)
            .fill(0)
            .map(() => (randomInteger(0, 10) > 4 ? randomInteger(1, 10) : 0))
        )
    );

  const animateLoop = _.debounce(function(props) {
    const grid = running ? drawNextGrid(props) : props.grid;

    if (mousePos) {
      const mouseRow = grid[mousePos.x];
      const mouseValue =
        typeof mouseRow === "object" ? mouseRow[mousePos.y] : false;
      if (!mouseValue) {
        grid[mousePos.x][mousePos.y] = randomInteger(1, 10);
        offscreenCtx.fillStyle = "#f1f1f1";
        offscreenCtx.fillRect(
          mousePos.y * squareSize,
          mousePos.x * squareSize,
          squareSize,
          squareSize
        );
        // offscreenCtx.strokeStyle = "#f1f1f1";

        // offscreenCtx.strokeRect(
        //   mousePos.y * squareSize,
        //   mousePos.x * squareSize,
        //   squareSize,
        //   squareSize
        // );
      }

      mousePos = "";
    }
    window.requestAnimationFrame(() => animateLoop({ ...props, grid }));
  }, speed);

  function setMousePos(e, canvas) {
    var rect = canvas.getBoundingClientRect();
    mousePos = {
      y: Math.floor((e.clientX - rect.left) / squareSize),
      x: Math.floor((e.clientY - rect.top) / squareSize)
    };
  }

  animateLoop({
    hue: randomInteger(10, 30),
    ctx,
    offscreenCtx,
    width,
    height,
    grid: initialGrid,
    squareSize,
    arrayHeight,
    arrayWidth
  });
})();
