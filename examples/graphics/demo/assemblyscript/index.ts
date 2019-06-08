// Set up our memory
// By growing our Wasm Memory by 1 page (64KB)
memory.grow(1);

// Function to generate our 100 x 100 checkerboard, pixel by pixel
export function generateCheckerBoard(
  darkValueRed: i32,
  darkValueGreen: i32,
  darkValueBlue: i32,
  lightValueRed: i32,
  lightValueGreen: i32,
  lightValueBlue: i32
): void {
  const checkerBoardSize = 20;

  // Since Linear memory is a 1 dimensional array, but we want a grid
  // we will be doing 2d to 1d mapping
  // https://softwareengineering.stackexchange.com/questions/212808/treating-a-1d-data-structure-as-2d-grid
  for (let x: i32 = 0; x < checkerBoardSize; x++) {
    for (let y: i32 = 0; y < checkerBoardSize; y++) {
      // Set our default case to be dark squares
      let isDarkSquare: boolean = true;

      // We should change our default case if
      // We are on an odd y
      if (y % 2 === 0) {
        isDarkSquare = false;
      }

      // Lastly, alternate on our x value
      if (x % 2 === 0) {
        isDarkSquare = !isDarkSquare;
      }

      // Now that we determined if we are dark or light,
      // Let's set our square value
      let squareValueRed = darkValueRed;
      let squareValueGreen = darkValueGreen;
      let squareValueBlue = darkValueBlue;
      if (!isDarkSquare) {
        squareValueRed = lightValueRed;
        squareValueGreen = lightValueGreen;
        squareValueBlue = lightValueBlue;
      }

      // Let's calculate our index, using our 2d -> 1d mapping.
      // And then multiple by 4, for each pixel property (r,g,b,a).
      let squareNumber = y * checkerBoardSize + x;
      let squareRgbaIndex = squareNumber * 4;

      // Finally store the values.
      store<u8>(squareRgbaIndex + 0, squareValueRed); // Red
      store<u8>(squareRgbaIndex + 1, squareValueGreen); // Green
      store<u8>(squareRgbaIndex + 2, squareValueBlue); // Blue
      store<u8>(squareRgbaIndex + 3, 255); // Alpha (Always opaque)
    }
  }
}
