import wasmInit from "./pkg/graphics.js";

const runWasm = async () => {
  // Instantiate our wasm module
  const rustWasm = await wasmInit("./pkg/graphics_bg.wasm");

  // Create a Uint8Array to give us access to Wasm Memory
  const wasmByteMemoryArray = new Uint8Array(rustWasm.memory.buffer);

  // Get our canvas element from our index.html
  const canvasElement = document.querySelector("canvas");

  // Set up Context and ImageData on the canvas
  const canvasContext = canvasElement.getContext("2d");
  const canvasImageData = canvasContext.createImageData(
    canvasElement.width,
    canvasElement.height
  );

  // Clear the canvas
  canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);

  const getDarkValue = () => {
    return Math.floor(Math.random() * 100);
  };

  const getLightValue = () => {
    return Math.floor(Math.random() * 127) + 127;
  };

  const drawCheckerBoard = () => {
    const checkerBoardSize = 20;

    // Generate a new checkboard in wasm
    rustWasm.generate_checker_board(
      getDarkValue(),
      getDarkValue(),
      getDarkValue(),
      getLightValue(),
      getLightValue(),
      getLightValue()
    );

    // Create a Uint8Array to give us access to Wasm Memory
    const wasmByteMemoryArray = new Uint8Array(rustWasm.memory.buffer);

    // Pull out the RGBA values from Wasm memory
    // Starting at the memory index of out output buffer (given by our pointer)
    // 20 * 20 * 4 = checkboard max X * checkerboard max Y * number of pixel properties (R,G.B,A)
    const outputPointer = rustWasm.get_output_buffer_pointer();
    const imageDataArray = wasmByteMemoryArray.slice(
      outputPointer,
      outputPointer + checkerBoardSize * checkerBoardSize * 4
    );

    // Set the values to the canvas image data
    canvasImageData.data.set(imageDataArray);

    // Clear the canvas
    canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);

    // Place the new generated checkerboard onto the canvas
    canvasContext.putImageData(canvasImageData, 0, 0);
  };

  drawCheckerBoard();
  setInterval(() => {
    drawCheckerBoard();
  }, 1000);
};
runWasm();
