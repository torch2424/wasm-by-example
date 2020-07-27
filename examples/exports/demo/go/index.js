// Imports are from the demo-util folder in the repo
// https://github.com/torch2424/wasm-by-example/blob/master/demo-util/
import { wasmBrowserInstantiate } from "/demo-util/instantiateWasm.js";
import { domConsoleLog } from "/demo-util/domConsole.js";

const go = new Go(); // Defined in wasm_exec.js. Don't forget to add this in your index.html.

const runWasm = async () => {
  // Get the importObject from the go instance.
  const importObject = go.importObject;

  // Instantiate our wasm module
  const wasmModule = await wasmBrowserInstantiate("./main.wasm", importObject);

  // Allow the wasm_exec go instance, bootstrap and execute our wasm module
  go.run(wasmModule.instance);

  // Call the Add function export from wasm, save the result
  const result = wasmModule.instance.exports.callMeFromJavascript(24, 24);

  domConsoleLog(result);
  domConsoleLog(wasmModule.instance.exports.ADD_CONSTANT); // Should return undefined
  domConsoleLog(wasmModule.instance.exports.addIntegerWithConstant); // Should return undefined
};
runWasm();
