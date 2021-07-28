// We are including as-bind from the npm CDN unpkg. If you use a JavaScript bundler, you could use "as-bind".
import * as AsBind from "https://unpkg.com/as-bind@0.8.0/dist/as-bind.esm.js";
import { domConsoleLog } from "/demo-util/domConsole.js";

const wasm = fetch("./addWasmByExample.wasm");

const asyncTask = async () => {
  const asBindInstance = await AsBind.instantiate(wasm);

  // You can now use your wasm / as-bind instance!
  const response = asBindInstance.exports.addWasmByExample("Hello from ");
  domConsoleLog(response); // Hello from Wasm By Example
};
asyncTask();
