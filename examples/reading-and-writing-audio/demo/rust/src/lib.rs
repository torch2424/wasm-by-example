// The wasm-pack uses wasm-bindgen to build and generate JavaScript binding file.
// Import the wasm-bindgen crate. 
use wasm_bindgen::prelude::*;

// Define our number of samples we handle at once
const NUMBER_OF_SAMPLES: usize = 1024;

// Create a static mutable byte buffers. 
// We will use these for passing audio samples from 
// javascript to wasm, and from wasm to javascript
// NOTE: global `static mut` means we will have "unsafe" code
// but for passing memory between js and wasm should be fine.
static mut INPUT_BUFFER: [u8; NUMBER_OF_SAMPLES] = [0; NUMBER_OF_SAMPLES];
static mut OUTPUT_BUFFER: [u8; NUMBER_OF_SAMPLES] = [0; NUMBER_OF_SAMPLES];

// Function to return a pointer to our 
// output buffer in wasm memory
#[wasm_bindgen]
pub fn get_input_buffer_pointer() -> *const u8 {
    let pointer: *const u8;
    unsafe {
        pointer = INPUT_BUFFER.as_ptr();
    }

    return pointer;
}

// Function to return a pointer to our 
// output buffer in wasm memory
#[wasm_bindgen]
pub fn get_output_buffer_pointer() -> *const u8 {
    let pointer: *const u8;
    unsafe {
        pointer = OUTPUT_BUFFER.as_ptr();
    }

    return pointer;
}

// Function to do the amplification.
// By taking the samples currently in the input buffer
// amplifying them, and placing the result in the output buffer
#[wasm_bindgen]
pub fn amplify_audio() {

    // Loop over the samples
    for i in 0..NUMBER_OF_SAMPLES {
        // Load the sample at the index
        let mut audio_sample: u8;
        unsafe {
            audio_sample = INPUT_BUFFER[i];
        }

        // Amplify the sample. All samples
        // Should be implemented as bytes.
        // Byte samples are represented as follows:
        // 127 is silence, 0 is negative max, 256 is positive max
        if audio_sample > 127 {
            let audio_sample_diff = audio_sample - 127;
            audio_sample = audio_sample + audio_sample_diff;
        } else if audio_sample < 127 {
            audio_sample = audio_sample / 2;
        }

        // Store the audio sample into our output buffer
        unsafe {
            OUTPUT_BUFFER[i] = audio_sample;
        }
    }
}

