package main


// Create a byte (uint8, not Go byte) buffer, which will be available in Wasm Memory. 
// We can then share this buffer with JS and Wasm.
const BUFFER_SIZE int = 2;
var buffer [BUFFER_SIZE]uint8;

// Declare a main function, this is the entrypoint into our go module
// That will be run. In our example, we won't need this
func main() {}

// Function to return a pointer (Index) to our buffer in wasm memory
//go:export getWasmMemoryBufferPointer
func getWasmMemoryBufferPointer() *[BUFFER_SIZE]uint8 {
  return &buffer
}

// Function to store the passed value at index 0,
// in our buffer 
//go:export storeValueInWasmMemoryBufferIndexZero
func storeValueInWasmMemoryBufferIndexZero(value uint8) {
  buffer[0] = value
}

// Function to read from index 1 of our buffer
// And return the value at the index
//go:export readWasmMemoryBufferAndReturnIndexOne
func readWasmMemoryBufferAndReturnIndexOne() uint8 {
  return buffer[1]
}



