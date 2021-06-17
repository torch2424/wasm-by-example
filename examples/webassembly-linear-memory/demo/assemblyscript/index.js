// Imports are from the demo-util folder in the repo
// https://github.com/torch2424/wasm-by-example/blob/master/demo-util/

import { wasmBrowserInstantiate } from "/demo-util/instantiateWasm.js";
import { domConsoleLog } from "/demo-util/domConsole.js";

const runWasmAdd = async () => {
  // Instantiate our wasm module
  const wasmModule = await wasmBrowserInstantiate("./index.wasm");

  // Get our exports object, with all of our exported Wasm Properties
  const exports = wasmModule.instance.exports;

  // Get our memory object from the exports
  const memory = exports.memory;

  // Create a Uint8Array to give us access to Wasm Memory
  const wasmByteMemoryArray = new Uint8Array(memory.buffer);

  // Let's read index zero from JS, to make sure Wasm wrote to
  // wasm memory, and JS can read the "passed" value from Wasm
  domConsoleLog("Read from JS index Zero: " + wasmByteMemoryArray[0]); // Should Log "24".

  // Next let's write to index one, to make sure we can
  // write wasm memory, and Wasm can read the "passed" value from JS
  wasmByteMemoryArray[1] = 15;
  domConsoleLog(
    "Read from Wasm index one: " + exports.readWasmMemoryAndReturnIndexOne()
  ); // Should Log "15"
};
runWasmAdd();
