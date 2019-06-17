// Add the wasm-pack crate
use wasm_bindgen::prelude::*;

// This exports an add function.
// It takes in two 32-bit integer values
// And returns a 32-bit integer value.
#[wasm_bindgen]
pub fn callMeFromJavascript(a: i32, b: i32) -> i32 {
    return addIntegerWithConstant(a, b);
}

// A NOT exported constant
// Rust does not support exporting constants
// for Wasm (that I know of).
const ADD_CONSTANT: i32 = 24;

// A NOT exported function
// It takes in two 32-bit integer values
// And returns a 32-bit integer value.
fn addIntegerWithConstant(a: i32, b: i32) -> i32 {
    return a + b + ADD_CONSTANT;
}

