// Set up our memory
// By growing our Wasm Memory by 1 page (64KB)
memory.grow(1);

// Create some buffer/pointers (array index and size) to where
// in memory we are storing the pixels.
// NOTE: Be sure to set a correct --memoryBase when
// when writing to memory directly like we are here.
// https://docs.assemblyscript.org/details/compiler
// Javascript writes to the INPUT_BUFFER,
// and Wasm will write the result in the OUTPUT_BUFFER
export const INPUT_BUFFER_POINTER: i32 = 0;
export const INPUT_BUFFER_SIZE: i32 = 1024;
export const OUTPUT_BUFFER_POINTER: i32 =
  INPUT_BUFFER_POINTER + INPUT_BUFFER_SIZE;
export const OUTPUT_BUFFER_SIZE: i32 = INPUT_BUFFER_SIZE;

// Function to do the amplification
export function amplifyAudioInBuffer(): void {
  // Loop over the samples
  for (let i = 0; i < INPUT_BUFFER_SIZE; i++) {
    // Load the sample at the index
    let audioSample: u8 = load<u8>(INPUT_BUFFER_POINTER + i);

    // Amplify the sample. All samples
    // Should be implemented as bytes.
    // Byte samples are represented as follows:
    // 127 is silence, 0 is negative max, 256 is positive max
    if (audioSample > 127) {
      let audioSampleDiff = audioSample - 127;
      audioSample = audioSample + audioSampleDiff;
    } else if (audioSample < 127) {
      audioSample = audioSample / 2;
    }

    // Store the audio sample into our output buffer
    store<u8>(OUTPUT_BUFFER_POINTER + i, audioSample);
  }
}
