// Imports are from the demo-util folder in the repo
// https://github.com/torch2424/wasm-by-example/blob/master/demo-util/
import { wasmBrowserInstantiate } from "/demo-util/instantiateWasm.js";
import { domConsoleLog } from "/demo-util/domConsole.js";

const go = new Go(); // Defined in wasm_exec.js. Don't forget to add this in your index.html.

const runWasmAdd = async () => {
  const importObject = go.importObject;

  // Instantiate our wasm module
  const wasmModule = await wasmBrowserInstantiate("./main.wasm", importObject);

  // You have to run the go instance before doing anything else, or else println and things won't work
  go.run(wasmModule.instance);

  /**
   * Part one: Write in Wasm, Read in JS
   */
  domConsoleLog("Write in Wasm, Read in JS, Index 0:");

  // First, let's have wasm write to our buffer
  wasmModule.instance.exports.storeValueInWasmMemoryBufferIndexZero(24);

  // Next, let's create a Uint8Array of our wasm memory
  let wasmMemory = new Uint8Array(wasmModule.instance.exports.memory.buffer);

  // Then, let's get the pointer to our buffer that is within wasmMemory
  let bufferPointer = wasmModule.instance.exports.getWasmMemoryBufferPointer();

  // Then, let's read the written value at index zero of the buffer,
  // by accessing the index of wasmMemory[bufferPointer + bufferIndex]
  domConsoleLog(wasmMemory[bufferPointer + 0]); // Should log "24"

  /**
   * Part two: Write in JS, Read in Wasm
   */
  domConsoleLog("Write in JS, Read in Wasm, Index 1:");

  // First, let's write to index one of our buffer
  wasmMemory[bufferPointer + 1] = 25;

  // Then, let's have wasm read index one of the buffer,
  // and return the result
  domConsoleLog(
    wasmModule.instance.exports.readWasmMemoryBufferAndReturnIndexOne()
  ); // Should log "25"

  /**
   * NOTE: if we were to continue reading and writing memory,
   * depending on how the memory is grown by rust, you may have
   * to re-create the Uint8Array since memory layout could change.
   * For example, `let wasmMemory = new Uint8Array(rustWasm.memory.buffer);`
   * In this example, we did not, but be aware this may happen :)
   */
};
runWasmAdd();
