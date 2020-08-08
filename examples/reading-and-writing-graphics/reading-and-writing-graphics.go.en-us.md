# Reading and Writing Graphics

## Overview

As stated before, **WebAssembly is a great fit for computationally intensive tasks**. For example, Tasks that involve things like big data, heavy logic with conditionals, or nested looping. Thus, generating / rendering graphics **can** get a significant speedup by moving these mentioned parts into WebAssembly. In this example, we will be generating 20x20 colored checkerboard images once per second, and displaying them on a [HTML5 Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) using [Pixel Manipulation on the ImageData Object](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas). In fancy graphics terms, this is a rasterizer.

**NOTE:** This example will continue to build on our simple buffer/pointer memory passing. This could be implemented using higher-level data structures, and these data structures will be covered in later examples.

So let's get into the example:

---

## Implementation

As usual, let's get started with our `main.go` file. You will notice here we set up a buffer, similar to the [WebAssembly Linear Memory example](/example-redirect?exampleName=webassembly-linear-memory). By doing this, Javascript can read the values placed into the buffer later. Please be sure to read the comments in the following code examples, and be sure to follow links or look at previous examples if something does not make sense. Let's get into it:

```go
package main

// Define the size of our "checkerboard"
const CHECKERBOARD_SIZE int = 20;

/*
* 1. What is going on here?
* Create a byte buffer.
* We will use for putting the output of our graphics,
* to pass the output to js.
*
* 2. Why is the size CHECKERBOARD_SIZE * CHECKERBOARD_SIZE * 4?
* We want to have 20 pixels by 20 pixels. And 4 colors per pixel (r,g,b,a)
* Which, the Canvas API Supports.
*/
const BUFFER_SIZE int = CHECKERBOARD_SIZE * CHECKERBOARD_SIZE * 4;
var graphicsBuffer [BUFFER_SIZE]uint8;


// Declare a main function, this is the entrypoint into our go module
// That will be run. In our example, we won't need this
func main() {}

// Function to return a pointer (Index) to our buffer in wasm memory
//export getGraphicsBufferPointer
func getGraphicsBufferPointer() *[BUFFER_SIZE]uint8 {
  return &graphicsBuffer
}

// Function to return the size of our buffer in wasm memory
//export getGraphicsBufferSize
func getGraphicsBufferSize() int {
  return BUFFER_SIZE;
}

// Function to generate our checkerboard, pixel by pixel
//export generateCheckerBoard
func generateCheckerBoard(
  darkValueRed uint8,
  darkValueGreen uint8,
  darkValueBlue uint8,
  lightValueRed uint8,
  lightValueGreen uint8,
  lightValueBlue uint8,
) {
  // Since Linear memory is a 1 dimensional array, but we want a grid
  // we will be doing 2d to 1d mapping
  // https://softwareengineering.stackexchange.com/questions/212808/treating-a-1d-data-structure-as-2d-grid
  for y := 0; y < CHECKERBOARD_SIZE; y++ {
    for x := 0; x < CHECKERBOARD_SIZE; x++ {
      // Set our default case to be dark squares
      isDarkSquare := true;

      // We should change our default case if
      // We are on an odd y
      if y % 2 == 0 {
        isDarkSquare = false;
      }

      // Lastly, alternate on our x value
      if x % 2 == 0 {
        isDarkSquare = !isDarkSquare;
      }

      // Now that we determined if we are dark or light,
      // Let's set our square value
      squareValueRed := darkValueRed;
      squareValueGreen := darkValueGreen;
      squareValueBlue := darkValueBlue;
      if !isDarkSquare {
      squareValueRed = lightValueRed;
      squareValueGreen = lightValueGreen;
      squareValueBlue = lightValueBlue;
      }

      // Let's calculate our index, using our 2d -> 1d mapping.
      // And then multiple by 4, for each pixel property (r,g,b,a).
      squareNumber := (y * CHECKERBOARD_SIZE) + x;
      squareRgbaIndex := squareNumber * 4;

      graphicsBuffer[squareRgbaIndex + 0] = squareValueRed; // Red
      graphicsBuffer[squareRgbaIndex + 1] = squareValueGreen; // Green
      graphicsBuffer[squareRgbaIndex + 2] = squareValueBlue; // Blue
      graphicsBuffer[squareRgbaIndex + 3] = 255; // Alpha (Always Opaque)
    }
  }
}
```

Then, let's compile `main.go` into a wasm module, using the TinyGo compiler. This will output a `main.wasm`:

```bash
tinygo build -o main.wasm -target wasm ./main.go
```

---

Then, let's create an `index.html`, and get our appropriate `wasm_exec.js` following the steps laid out in the [Hello World Example](/example-redirect?exampleName=hello-world) example. Also, we will add a canvas element so we can output the framebuffer that we will be rendering. **Random tip:** use the [image-rendering](https://css-tricks.com/almanac/properties/i/image-rendering/) property to display pixel art, and other "sharp" images correctly.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Reading and Writing Graphics - Go</title>
  </head>
  <body>
    <canvas
      width="20"
      height="20"
      style="image-rendering: pixelated; image-rendering: crisp-edges; width: 100%;"
    ></canvas>
    <script src="./wasm_exec.js"></script>
    <script type="module" src="./index.js"></script>
  </body>
</html>
```

Next, Let's load / instantiate the wasm module, `main.wasm` in a new `index.js` file. Again, we will follow the module instantiation from the [Hello World](/example-redirect?exampleName=hello-world) example. A lot of the logic here is expanding on the [WebAssembly Linear Memory Example](/example-redirect?exampleName=webassembly-linear-memory), but applying the learnings to a DOM API. The most important thing here is probably how we are copying out memory from Wasm, using `.slice` calls. Please see the reference links if things get confusing. Here is the `index.js` below!

```javascript
// Imports are from the demo-util folder in the repo
// https://github.com/torch2424/wasm-by-example/blob/master/demo-util/
import { wasmBrowserInstantiate } from "/demo-util/instantiateWasm.js";

const go = new Go(); // Defined in wasm_exec.js. Don't forget to add this in your index.html.

const runWasm = async () => {
  // Get the importObject from the go instance.
  const importObject = go.importObject;

  // Instantiate our wasm module
  const wasmModule = await wasmBrowserInstantiate("./main.wasm", importObject);

  // Allow the wasm_exec go instance, bootstrap and execute our wasm module
  go.run(wasmModule.instance);

  // Get our exports object, with all of our exported Wasm Properties
  const exports = wasmModule.instance.exports;

  // Get our memory object from the exports
  const memory = exports.memory;

  // Create a Uint8Array to give us access to Wasm Memory
  const wasmByteMemoryArray = new Uint8Array(memory.buffer);

  // Get the pointer (index) to where our graphics buffer is located in wasm linear memory
  const graphicsBufferPointer = exports.getGraphicsBufferPointer();

  // Get the size of our graphics buffer that is located in wasm linear memory
  const graphicsBufferSize = exports.getGraphicsBufferSize();

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
    exports.generateCheckerBoard(
      getDarkValue(),
      getDarkValue(),
      getDarkValue(),
      getLightValue(),
      getLightValue(),
      getLightValue()
    );

    // Pull out the RGBA values from Wasm memory, the we wrote to in wasm,
    // starting at the checkerboard pointer (memory array index)
    const imageDataArray = wasmByteMemoryArray.slice(
      graphicsBufferPointer,
      graphicsBufferPointer + graphicsBufferSize
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
```

And you should get something similar to the demo ([Source Code](/source-redirect?path=examples/reading-and-writing-graphics/demo/go)) below!

---

## Demo

<iframe width="300px" height="300px" title="Go Demo" src="/demo-redirect?example-name=reading-and-writing-graphics"></iframe>

Next, lets took a look at an example of [Reading and Writing Audio with WebAssembly](/example-redirect?exampleName=reading-and-writing-audio).
