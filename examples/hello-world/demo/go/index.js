// Imports are from the demo-util folder in the repo
// https://github.com/torch2424/wasm-by-example/blob/master/demo-util/
import { wasmBrowserInstantiate } from "/demo-util/instantiateWasm.js";

const go = new Go(); // Defined in wasm_exec.js. Don't forget to add this in your index.html.

const jsAdd = (x, y) => x + y;

const runWasmAdd = async () => {
  const importObject = go.importObject;
  importObject.env["./main.go.jsadd"] = jsAdd;

  // Instantiate our wasm module
  const wasmModule = await wasmBrowserInstantiate("./main.wasm", importObject);

  console.log("exports", wasmModule.instance.exports);

  // You have to run the go instance before doing anything else, or else println and things won't work
  go.run(wasmModule.instance);

  // Call the Add function export from wasm, save the result
  const addResult = wasmModule.instance.exports.add(24, 24);

  const bufferPointer = wasmModule.instance.exports.getWasmMemoryBufferPointer();

  console.log(bufferPointer);

  const wasmMemory = new Uint8Array(wasmModule.instance.exports.memory.buffer);
  wasmMemory[bufferPointer] = 24;

  // console.log(wasmMemory);

  // console.log(wasmMemory[bufferPointer]);

  wasmModule.instance.exports.logBuffer();

  // Set the result onto the body
  document.body.textContent = `Hello World! addResult: ${addResult}`;
};
runWasmAdd();
