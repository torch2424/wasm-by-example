# Hello World!

**Before getting started with Rust and Wasm, be sure to check out all of the languages available, by clicking the "languages" link in the header.**

## Overview

For our first program, we will be doing a "Hello world" type of program in [Rust](https://www.rust-lang.org/) and [wasm-pack](https://github.com/rustwasm/wasm-pack).

To keep things simple with Wasm's limitations mentioned [in the introduction example](/example-redirect?exampleName=introduction&programmingLanguage=all), instead of displaying a string, we will add two numbers together and display the result. Though, it is good to keep in mind, in later examples, a lot of these limitations will be abstracted away by your WebAssembly Language of choice (In this case, Rust). It is also highly reccommended you take a look at the [wasm-pack QuickStart Guide](https://github.com/rustwasm/wasm-pack#-quickstart-guide), as it will be referenced a lot in this example.

---

## Implementation

So first, Let's get [rust installed](https://www.rust-lang.org/tools/install), which includes [cargo](https://doc.rust-lang.org/cargo/index.html). Then, using cargo, let's install wasm-pack, which we will need later:

```bash
cargo install wasm-pack
```

Next, let's create our rust crate in our current directory using cargo:

```bash
cargo init
```

Then, let's edit our new `Cargo.toml` to implement [wasm-pack](https://github.com/rustwasm/wasm-pack#-quickstart-guide) as mentioned in their quickstart:

```toml
[package]
name = "hello-world"
version = "0.1.0"
authors = ["Your Name <your@name.com>"]
edition = "2018"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"
```

Next, let's take a peek at the `src/` directory. Let's go ahead and replace `src/main.rs` with the required `use` call as mentioned in the quickstart, as well as our add function:

```rust
// Add the wasm-pack crate
use wasm_bindgen::prelude::*;

// Our Add function
// wasm-pack requires "exported" functions
// to include #[wasm_bindgen]
#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
  return a + b;
}
```

Then, let's compile our crate using wasm-pack, into a wasm module. **Firt, let's rename `src/main.rs`, to `src/lib.rs`**. Then run the following command, taking note of the [--target web](https://rustwasm.github.io/docs/wasm-pack/commands/build.html#target) since we want an ES6 module in our case:

```bash
wasm-pack build --target web
```

This will output a `pkg/` directory containing our wasm module, wrapped in a js object. Next, lets create an `index.js` JavaScript file, and import the outputted ES6 module in our `pkg/` directory. Then, we will call our exported `add()` function:

```javascript
import wasmInit from "./pkg/hello_world.js";

const runWasm = async () => {
  // Instantiate our wasm module
  const helloWorld = await wasmInit("./pkg/hello_world_bg.wasm");

  // Call the Add function export from wasm, save the result
  const addResult = helloWorld.add(24, 24);

  // Set the result onto the body
  document.body.textContent = `Hello World! addResult: ${addResult}`;
};
runWasm();
```

Lastly, lets load our ES6 Module, `index.js` Javascript file in our `index.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Hello World - Rust</title>
    <script type="module" src="./index.js"></script>
  </head>
  <body></body>
</html>
```

And we should have a working Wasm Add (Hello World) program! Congrats!

You should have something similar to the demo ([Source Code](/source-redirect?path=examples/hello-world/demo/rust)) below:

## Demo

<iframe src="/examples/hello-world/demo/rust/"></iframe>

Next let's take a deeper look at WebAssembly [Exports](/example-redirect?exampleName=exports).
