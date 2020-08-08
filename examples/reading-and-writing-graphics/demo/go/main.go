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


