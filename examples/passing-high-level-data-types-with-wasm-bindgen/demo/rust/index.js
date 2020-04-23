// Here we are importing the default export from our
// Outputted wasm-bindgen ES Module. As well as importing
// the named exports that are individual wrapper functions
// to facilitate handle data passing between JS and Wasm.
import wasmInit, {
  add_wasm_by_example_to_string,
  test
} from "./pkg/strings.js";
// https://github.com/torch2424/wasm-by-example/blob/master/demo-util/
import { domConsoleLog } from "/demo-util/domConsole.js";

const runWasm = async () => {
  // Instantiate our wasm module
  const rustWasm = await wasmInit("./pkg/strings_bg.wasm");

  // Call our exported function
  const helloString = add_wasm_by_example_to_string("Hello from ");

  // Log the result to the console
  domConsoleLog(helloString);
};
runWasm();
