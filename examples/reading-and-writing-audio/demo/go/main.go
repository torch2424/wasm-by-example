package main

// Create some buffer/pointers (array index and size) to where
// in memory we are storing the pixels.
// Javascript writes to the INPUT_BUFFER,
// and Wasm will write the result in the OUTPUT_BUFFER
const INPUT_BUFFER_SIZE int = 1024;
var inputBuffer [INPUT_BUFFER_SIZE]uint8;
const OUTPUT_BUFFER_SIZE int = INPUT_BUFFER_SIZE;
var outputBuffer [OUTPUT_BUFFER_SIZE]uint8;

// Declare a main function, this is the entrypoint into our go module
// That will be run. In our example, we won't need this
func main() {}

// Functions to return a pointer (Index) to our buffer in wasm memory

//export getInputBufferPointer
func getInputBufferPointer() *[INPUT_BUFFER_SIZE]uint8 {
  return &inputBuffer
}

//export getOutputBufferPointer
func getOutputBufferPointer() *[OUTPUT_BUFFER_SIZE]uint8 {
  return &outputBuffer
}


// Function to return the size of our buffer in wasm memory

//export getInputBufferSize
func getInputBufferSize() int {
  return INPUT_BUFFER_SIZE;
}

//export getOutputBufferSize
func getOutputBufferSize() int {
  return OUTPUT_BUFFER_SIZE;
}

// Function to do the amplification
//export amplifyAudioInBuffer
func amplifyAudioInBuffer() {
  // Loop over the samples
  for i := 0; i < INPUT_BUFFER_SIZE; i++ {
    // Load the sample at the index
    audioSample := inputBuffer[i];

    // Amplify the sample. All samples
    // Should be implemented as bytes.
    // Byte samples are represented as follows:
    // 127 is silence, 0 is negative max, 256 is positive max
    if audioSample > 127 {
      audioSampleDiff := audioSample - 127;
      audioSample = audioSample + audioSampleDiff;
    } else if audioSample < 127 {
      audioSample = audioSample / 2;
    }

    // Store the audio sample into our output buffer
    outputBuffer[i] = audioSample;
  }
}


