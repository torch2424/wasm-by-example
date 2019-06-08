// Set up our memory
// By growing our Wasm Memory by 1 page (64KB)
memory.grow(1);

// Store the value 24 at index 0
const index = 0;
const value = 24;
store<u8>(index, value);

// Export a function that will read wasm memory
// and return the value at index 1
export function readWasmMemoryAndReturnIndexOne(): i32 {
  // Read the value at indexOne
  let valueAtIndexOne = load<u8>(1);
  return valueAtIndexOne;
}
