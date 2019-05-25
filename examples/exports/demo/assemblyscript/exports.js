// Imports are from the demo-util folder in the repo
// https://github.com/torch2424/wasm-by-example/blob/master/demo-util/
import { wasmBrowserInstantiate } from "/demo-util/instantiateWasm.js";
import { domConsoleLog } from "/demo-util/domConsole.js";

const runWasmAdd = async () => {
  // Instantiate our wasm module
  const wasmModule = await wasmBrowserInstantiate(
    "/examples/exports/demo/assemblyscript/exports.wasm"
  );

  // Get our exports object, with all of our exported Wasm Properties
  const exports = wasmModule.instance.exports;

  domConsoleLog(exports.callMeFromJavascript(24, 24)); // Logs 48

  // Since our constant is a global we use `.valueOf()`.
  // Though, in some cases this could simply be: exports.GET_THIS_CONSTANT_FROM_JAVASCRIPT
  domConsoleLog(exports.GET_THIS_CONSTANT_FROM_JAVASCRIPT.valueOf()); // Logs 2424

  // Trying to access a property we did NOT export
  domConsoleLog(exports.addIntegerWithConstant); // Logs undefined
};
runWasmAdd();
