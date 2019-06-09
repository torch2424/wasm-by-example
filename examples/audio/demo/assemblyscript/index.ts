// Set up our memory
// By growing our Wasm Memory by 1 page (64KB)
memory.grow(1);

// Function to do the amplification
// inputPointer is where (memory index) we placed the input audio samples.
// inputLength is the number of samples in the audio buffer (that the pointer points to).
export function amplifyAudioInBuffer(inputPointer: i32, inputLength: i32): i32 {
  // Create a pointer (memory index) of where
  // We will place the output audio samples
  // For this example, it will be right after the input
  let outputPointer: i32 = inputPointer + inputLength;

  // Loop over the samples
  for (let i = 0; i < inputLength; i++) {
    // Load the sample at the index
    let audioSample: u8 = load<u8>(inputPointer + i);

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
    store<u8>(outputPointer + i, audioSample);
  }

  // Return where we placed the output buffer
  return outputPointer;
}
