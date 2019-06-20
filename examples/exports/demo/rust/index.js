import wasmInit from "./pkg/exports.js";
// https://github.com/torch2424/wasm-by-example/blob/master/demo-util/
import { domConsoleLog } from "/demo-util/domConsole.js";

const runWasm = async () => {
  // Instantiate our wasm module
  const rustWasm = await wasmInit("./pkg/exports_bg.wasm");

  // Call the Add function export from wasm, save the result
  const result = rustWasm.call_me_from_javascript(24, 24);

  domConsoleLog(result);
  domConsoleLog(rustWasm.ADD_CONSTANT); // Should return undefined
  domConsoleLog(rustWasm.add_integer_with_constant); // Should return undefined
};
runWasm();
