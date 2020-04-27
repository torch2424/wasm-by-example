// Imports are from the demo-util folder in the repo
// https://github.com/torch2424/wasm-by-example/blob/master/demo-util/
import { wasmBrowserInstantiate } from "/demo-util/instantiateWasm.js";

const go = new Go(); // Defined in wasm_exec.js

const runWasmAdd = async () => {
  // Instantiate our wasm module
  const wasmModule = await wasmBrowserInstantiate(
    "./main.wasm",
    go.importObject
  );

  // Call the Add function export from wasm, save the result
  const addResult = wasmModule.instance.exports.add(24, 24);

  // Set the result onto the body
  document.body.textContent = `Hello World! addResult: ${addResult}`;
};
runWasmAdd();
