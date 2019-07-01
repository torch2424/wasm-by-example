# Strings

## Overview

Using buffers and pointers, is a great way to get started with WebAssembly, and drill in its concepts while being productive. But once we start wanting to use higher level data structures efficiently and easily, is where things will get a little more complicated. Thankfully, the rust/wasm communitty built [wasm-bindgen](https://github.com/rustwasm/wasm-bindgen), which is part of the wasm-pack workflow we have been using throughout the examples. As mentioned before, wasm-bindgen abstracts away linear memory, and allows using higher-level data structures between Rust and JavaScript.

Let's kick things off! Let's see how we can use strings in WebAssembly, and share them with JavaScript:

---

## Implementation

First, let's add the following to our `src/lib.rs` file:

```rust
// Add the wasm-pack crate
use wasm_bindgen::prelude::*;

// Our function to concatenate the string "Wasm by Example"
// to the input string. We are using .into(), to convert
// the rust types of str to a String.
#[wasm_bindgen]
pub fn add_wasm_by_example_to_string(input_string: String) -> String {
  let result = format!("{} {}", input_string, "Wasm by Example");
  return result.into();
}
```

Next, we can compile the module following the [Hello World](/example-redirect?exampleName=hello-world) examples compilation process, replacing the appropriate file names.

Next, lets create an `index.js` file to load and run our wasm output.Now that we are using higher-level stata structures, we will have to leverage the named exports in our `./pkg/strings.js`. TODO finish this. Something about [wasm-bindgen Strings](https://rustwasm.github.io/docs/wasm-bindgen/reference/types/string.html). Let's dive into our resulting `index.js`:

```javascript
// Here we are importing the default export from our
// Outputted wasm-bindgen ES Module. As well as importing
// the named exports that are individual wrapper functions
// to facilitate handle data passing between JS and Wasm.
import wasmInit, {
  add_wasm_by_example_to_string,
  test
} from "./pkg/strings.js";

const runWasm = async () => {
  // Instantiate our wasm module
  const rustWasm = await wasmInit("./pkg/strings_bg.wasm");

  // Call our exported function
  const helloString = add_wasm_by_example_to_string("Hello from ");

  // Log the result to the console
  console.log(helloString);
};
runWasm();
```

Lastly, lets load our ES6 Module, `index.js` Javascript file in our `index.html`. And you should get something similar to the demo ([Source Code](/source-redirect?path=examples/strings/demo/rust)) below!

---

## Demo

<iframe width="350px" height="200px" title="Rust Demo" src="/examples/strings/demo/rust/"></iframe>

This is the end of the examples for now! More will be in the works, and feel free to [fix, suggest, or contribute examples](https://github.com/torch2424/wasm-by-example)!
