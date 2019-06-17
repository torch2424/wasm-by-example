// This example is a simplified version of: 
// https://github.com/rustwasm/wasm-bindgen/blob/master/examples/console_log/src/lib.rs

// Add the wasm-pack crate
use wasm_bindgen::prelude::*;

// Let's define our external function (imported from JS)
// Here, we will define our external `console.log`
#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn console_log_from_wasm() {
    log("This console.log is from wasm!");
}

