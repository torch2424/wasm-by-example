import wasmInit from "./pkg/importing_javascript_functions_into_webassembly.js";

const runWasm = async () => {
  // Instantiate our wasm module
  const rustWasm = await wasmInit(
    "./pkg/importing_javascript_functions_into_webassembly_bg.wasm"
  );

  // Run the exported function
  rustWasm.console_log_from_wasm(); // Should log "This console.log is from wasm!"
};
runWasm();
