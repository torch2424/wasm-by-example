# WebAssembly Linear Memory

## Overview

Another feature of WebAssembly, is its linear memory. Linear memory is a continuous buffer of unsigned bytes that can be read from and stored into by both Wasm and Javascript. In other words, Wasm memory is an expandable array of bytes that Javascript and Wasm can synchronously read and modify. Linear memory can be used for many things, one of them being passing values back and forth between Wasm and Javascript.

For this example, we will use byte (Unsigned 8-bit integer) buffers and pointers (Wasm memory array indexes) as a way to pass memory back and forth, and show off the concept.

Let's see how we can use linear memory:

---

## Implementation

First, let's add the following to our `main.go` file:

```go
package main

// Create a byte (uint8, not Go byte) buffer, which will be available in Wasm Memory.
// We can then share this buffer with JS and Wasm.
const BUFFER_SIZE int = 2;
var buffer [BUFFER_SIZE]uint8;

// Declare a main function, this is the entrypoint into our go module
// That will be run. In our example, we won't need this
func main() {}

// Function to return a pointer (Index) to our buffer in wasm memory
//export getWasmMemoryBufferPointer
func getWasmMemoryBufferPointer() *[BUFFER_SIZE]uint8 {
  return &buffer
}

// Function to store the passed value at index 0,
// in our buffer
//export storeValueInWasmMemoryBufferIndexZero
func storeValueInWasmMemoryBufferIndexZero(value uint8) {
  buffer[0] = value
}

// Function to read from index 1 of our buffer
// And return the value at the index
//export readWasmMemoryBufferAndReturnIndexOne
func readWasmMemoryBufferAndReturnIndexOne() uint8 {
  return buffer[1]
}
```

Then, let's compile `main.go` into a wasm module, using the TinyGo compiler. This will output a `main.wasm`:

```bash
tinygo build -o main.wasm -target wasm ./main.go
```

---

Then, let's create an `index.html`, and get our appropriate `wasm_exec.js` following the steps laid out in the [Hello World Example](/example-redirect?exampleName=hello-world) example.

---

Lastly, lets create our `index.js` JavaScript file. We will be using the same `wasmBrowserInstantiate` as mentioned in the [Hello World Example](/example-redirect?exampleName=hello-world) example:

```javascript
const go = new Go(); // Defined in wasm_exec.js. Don't forget to add this in your index.html.

const runWasm = async () => {
  const importObject = go.importObject;

  // Instantiate our wasm module
  const wasmModule = await wasmBrowserInstantiate("./main.wasm", importObject);

  // You have to run the go instance before doing anything else, or else println and things won't work
  go.run(wasmModule.instance);

  /**
   * Part one: Write in Wasm, Read in JS
   */
  console.log("Write in Wasm, Read in JS, Index 0:");

  // First, let's have wasm write to our buffer
  wasmModule.instance.exports.storeValueInWasmMemoryBufferIndexZero(24);

  // Next, let's create a Uint8Array of our wasm memory
  let wasmMemory = new Uint8Array(wasmModule.instance.exports.memory.buffer);

  // Then, let's get the pointer to our buffer that is within wasmMemory
  let bufferPointer = wasmModule.instance.exports.getWasmMemoryBufferPointer();

  // Then, let's read the written value at index zero of the buffer,
  // by accessing the index of wasmMemory[bufferPointer + bufferIndex]
  console.log(wasmMemory[bufferPointer + 0]); // Should log "24"

  /**
   * Part two: Write in JS, Read in Wasm
   */
  console.log("Write in JS, Read in Wasm, Index 1:");

  // First, let's write to index one of our buffer
  wasmMemory[bufferPointer + 1] = 15;

  // Then, let's have wasm read index one of the buffer,
  // and return the result
  console.log(
    wasmModule.instance.exports.readWasmMemoryBufferAndReturnIndexOne()
  ); // Should log "15"

  /**
   * NOTE: if we were to continue reading and writing memory,
   * depending on how the memory is grown by rust, you may have
   * to re-create the Uint8Array since memory layout could change.
   * For example, `let wasmMemory = new Uint8Array(rustWasm.memory.buffer);`
   * In this example, we did not, but be aware this may happen :)
   */
};
runWasm();
```

And that should be it! You should have something similar to the demo ([Source Code](/source-redirect?path=examples/webassembly-linear-memory/demo/go)) below:

---

## Demo

<iframe title="Go Demo" src="/demo-redirect?example-name=webassembly-linear-memory"></iframe>

Next let's take a look at [importing JavaScript functions into WebAssembly](/example-redirect?exampleName=importing-javascript-functions-into-webassembly).
