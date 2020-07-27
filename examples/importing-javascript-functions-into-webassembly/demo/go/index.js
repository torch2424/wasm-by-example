// Imports are from the demo-util folder in the repo
// https://github.com/torch2424/wasm-by-example/blob/master/demo-util/
import { wasmBrowserInstantiate } from "/demo-util/instantiateWasm.js";
import { domConsoleLog } from "/demo-util/domConsole.js";

const go = new Go(); // Defined in wasm_exec.js. Don't forget to add this in your index.html.

const runWasm = async () => {
  // Get the importObject from the go instance.
  const importObject = go.importObject;
  // Set our function we want to use from WebAssembly, on our importObject
  // This should be set on the env key, of the import object.
  // The function itself should be set on the env object, where the key is
  // depending on the compiler, usually in the format similar to below,
  // but you can check for the "LinkError: WebAssembly.instantiate()",
  // which would show the name required.
  importObject.env["./main.go.jsPrintInt"] = value => domConsoleLog(value);

  // Instantiate our wasm module
  const wasmModule = await wasmBrowserInstantiate("./main.wasm", importObject);

  // Allow the wasm_exec go instance, bootstrap and execute our wasm module
  go.run(wasmModule.instance);

  // Call the export from wasm
  wasmModule.instance.exports.printIntFromWasm(24);
};
runWasm();
