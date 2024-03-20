#include <stdbool.h>
#include <stdint.h>

// Define the size of our checkerboard
#define CHECKERBOARD_SIZE 20

// Create a buffer to where in memory
// we are storing the pixels.
uint8_t CHECKERBOARD_BUFFER[CHECKERBOARD_SIZE * CHECKERBOARD_SIZE * 4] = { 0 };

// Function to generate our checkerboard, pixel by pixel
void
generateCheckerBoard(
	uint8_t darkValueRed,
	uint8_t darkValueGreen,
	uint8_t darkValueBlue,
	uint8_t lightValueRed,
	uint8_t lightValueGreen,
	uint8_t lightValueBlue
) {
	// Since Linear memory is a 1 dimensional array, but we want a grid
	// we will be doing 2d to 1d mapping
	// https://softwareengineering.stackexchange.com/questions/212808/treating-a-1d-data-structure-as-2d-grid
	for (int x = 0; x < CHECKERBOARD_SIZE; x++)
	{
		for (int y = 0; y < CHECKERBOARD_SIZE; y++)
		{

			// Set our default case to be dark squares
			bool isDarkSquare = true;

			// We should change our default case if
			// We are on an odd y
			if (y % 2 == 0)
			{
				isDarkSquare = false;
			}

			// Lastly, alternate on our x value
			if (x % 2 == 0)
			{
				isDarkSquare = !isDarkSquare;
			}

			// Now that we determined if we are dark or light,
			// Let's set our square value
			uint8_t squareValueRed = darkValueRed;
			uint8_t squareValueGreen = darkValueGreen;
			uint8_t squareValueBlue = darkValueBlue;
			if (!isDarkSquare)
			{
				squareValueRed = lightValueRed;
				squareValueGreen = lightValueGreen;
				squareValueBlue = lightValueBlue;
			}

			// Let's calculate our index, using our 2d -> 1d mapping.
			// And then multiple by 4, for each pixel property (r,g,b,a).
			int squareNumber = (x * CHECKERBOARD_SIZE) + y;
			int squareRgbaIndex = squareNumber * 4;

			// Finally store the values.
			CHECKERBOARD_BUFFER[squareRgbaIndex + 0] = squareValueRed;
			CHECKERBOARD_BUFFER[squareRgbaIndex + 1] = squareValueGreen;
			CHECKERBOARD_BUFFER[squareRgbaIndex + 2] = squareValueBlue;
			CHECKERBOARD_BUFFER[squareRgbaIndex + 3] = 255; // Alpha (Always opaque)
		}
	}
}

uint32_t getCheckboardSize()
{
    return CHECKERBOARD_SIZE * CHECKERBOARD_SIZE * 4;
}