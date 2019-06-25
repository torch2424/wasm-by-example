// Add the wasm-pack crate
use wasm_bindgen::prelude::*;

// Define the size of our "checkerboard"
const CHECKERBOARD_SIZE: usize = 20;

/*
 * 1. What is going on here?
 * Create a static mutable byte buffer. 
 * We will use for putting the output of our graphics,
 * to pass the output to js.
 * NOTE: global `static mut` means we will have "unsafe" code
 * but for passing memory between js and wasm should be fine.
 *
 * 2. Why is the size CHECKERBOARD_SIZE * CHECKERBOARD_SIZE * 4?
 * We want to have 20 pixels by 20 pixels. And 4 colors per pixel (r,g,b,a)
 * Which, the Canvas API Supports.
 */
const OUTPUT_BUFFER_SIZE: usize = CHECKERBOARD_SIZE * CHECKERBOARD_SIZE * 4;
static mut OUTPUT_BUFFER: [u8; OUTPUT_BUFFER_SIZE] = [0; OUTPUT_BUFFER_SIZE];

// Function to return a pointer to our buffer
// in wasm memory
#[wasm_bindgen]
pub fn get_output_buffer_pointer() -> *const u8 {
    let pointer: *const u8;
    unsafe {
        pointer = OUTPUT_BUFFER.as_ptr();
    }

    return pointer;
}

// Function to generate our checkerboard, pixel by pixel
#[wasm_bindgen]
pub fn generate_checker_board(
    dark_value_red: u8,
    dark_value_green: u8,
    dark_value_blue: u8,
    light_value_red: u8,
    light_value_green: u8,
    light_value_blue: u8
    ) {

    // Since Linear memory is a 1 dimensional array, but we want a grid
    // we will be doing 2d to 1d mapping
    // https://softwareengineering.stackexchange.com/questions/212808/treating-a-1d-data-structure-as-2d-grid
    for y in 0..CHECKERBOARD_SIZE {
        for x in 0..CHECKERBOARD_SIZE {
            // Set our default case to be dark squares
            let mut is_dark_square: bool = true;

            // We should change our default case if
            // We are on an odd y
            if y % 2 == 0 {
                is_dark_square = false;
            }

            // Lastly, alternate on our x value
            if x % 2 == 0 {
                is_dark_square = !is_dark_square;
            }

            // Now that we determined if we are dark or light,
            // Let's set our square value
            let mut square_value_red: u8 = dark_value_red;
            let mut square_value_green: u8 = dark_value_green;
            let mut square_value_blue: u8 = dark_value_blue;
            if !is_dark_square {
                square_value_red = light_value_red;
                square_value_green = light_value_green;
                square_value_blue = light_value_blue;
            }

            // Let's calculate our index, using our 2d -> 1d mapping.
            // And then multiple by 4, for each pixel property (r,g,b,a).
            let square_number: usize = y * CHECKERBOARD_SIZE + x;
            let square_rgba_index: usize = square_number * 4;

            // Finally store the values.
            unsafe {
                OUTPUT_BUFFER[square_rgba_index + 0] = square_value_red; // Red
                OUTPUT_BUFFER[square_rgba_index + 1] = square_value_green; // Green
                OUTPUT_BUFFER[square_rgba_index + 2] = square_value_blue; // Blue
                OUTPUT_BUFFER[square_rgba_index + 3] = 255; // Alpha (Always Opaque)
            }
        }
    }
}
