import wasmInit from "./pkg/exports.js";
// https://github.com/torch2424/wasm-by-example/blob/master/demo-util/
import { domConsoleLog } from "/demo-util/domConsole.js";

const runWasm = async () => {
  // Instantiate our wasm module
  const rustWasm = await wasmInit("./pkg/exports_bg.wasm");

  // Call the Add function export from wasm, save the result
  const result = rustWasm.callMeFromJavascript(24, 24);

  domConsoleLog(result);
  domConsoleLog(rustWasm.ADD_CONSTANT); // Should return undefined
  domConsoleLog(rustWasm.addIntegerWithConstant); // Should return undefined
};
runWasm();
