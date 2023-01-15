# Hello World!

**Before getting started, be sure to check out all of the languages available, by clicking the "languages" dropdown in the header.**

## Overview

For our first program, we will be doing a "Hello world" type of program in [Rust](https://www.rust-lang.org/) and [wasm-pack](https://github.com/rustwasm/wasm-pack).

To keep things simple with Wasm's limitations mentioned [in the introduction example](/example-redirect?exampleName=introduction&programmingLanguage=all), instead of displaying a string, we will add two numbers together and display the result. It is good to keep in mind, though, that in later examples a lot of these limitations will be abstracted away by your WebAssembly language of choice (in this case, Rust). It is also highly recommended you take a look at the [wasm-pack quickstart guide](https://github.com/rustwasm/wasm-pack#-quickstart-guide), as it will be referenced a lot in this example.

---

## Project Setup

First, let's get [Rust installed](https://www.rust-lang.org/tools/install) which includes [cargo](https://doc.rust-lang.org/cargo/index.html). Then, using cargo, let's install wasm-pack, which we will need later:

```bash
cargo install wasm-pack
```

Next, let's create a Rust crate in our current directory using cargo:

```bash
cargo init
```

Then, let's edit our new `Cargo.toml` to implement [wasm-pack](https://github.com/rustwasm/wasm-pack#-quickstart-guide) as mentioned in their quickstart guide:

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

Lastly, we'll take a quick peek inside the `src/` directory. Since we are building a library (lib) to be used by a larger application, **we need to rename the `src/main.rs` to `src/lib.rs`.** Go ahead and do that now before moving forward.

Now that we have our project and environment set up, on to the actual implementation.

---

## Implementation

In `src/lib.rs`, import the prelude of `wasm-bindgen` and define our `add` function:

```rust
// The wasm-pack uses wasm-bindgen to build and generate JavaScript binding file.
// Import the wasm-bindgen crate.
use wasm_bindgen::prelude::*;

// Our addition function
// wasm-pack requires "exported" functions
// to include #[wasm_bindgen]
#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
  return a + b;
}
```

Next, let's compile our crate using wasm-pack into a Wasm module. Then run the following command, taking note of the [`--target web`](https://rustwasm.github.io/docs/wasm-pack/commands/build.html#target). The wasm-pack tool has support for a lot of different output types, especially for bundlers like Webpack or Rollup. But, since we want an ES6 module in our case, we use the `web` target below:

```bash
wasm-pack build --target web
```

This will output a `pkg/` directory containing our Wasm module, wrapped in a JS object. Next, let's create an `index.js` JavaScript file, and import the outputted ES6 module in our `pkg/` directory. Then, we will call our exported `add()` function:

> **NOTE:** In this example, we are using the exported function from the Wasm module directly to help highlight the WebAssembly API. `wasm-bindgen` generates JavaScript bindings code that can be imported as an ES6 import, and is the recommended way to work with your Rust Wasm modules. These JavaScript bindings are shown in the "Passing High Level Data Types with `wasm-bindgen`" example.

```javascript
// Import our outputted Wasm ES6 module
// Which exports an initialization function
import init from "./pkg/hello_world.js";

const runWasm = async () => {
  // Instantiate our Wasm module
  const helloWorld = await init("./pkg/hello_world_bg.wasm");

  // Call the Add function export from Wasm, save the result
  const addResult = helloWorld.add(24, 24);

  // Set the result onto the body
  document.body.textContent = `Hello World! addResult: ${addResult}`;
};
runWasm();
```

Lastly, let's load our ES6 Module, `index.js` JavaScript file in our `index.html`:

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

And we should have a working Wasm program that adds (Hello World)! Congrats!

You should have something similar to the demo ([Source Code](/source-redirect?path=examples/hello-world/demo/rust)) below:

## Demo

<iframe title="Rust Demo" src="/demo-redirect?example-name=hello-world"></iframe>

Next, let's take a deeper look at WebAssembly [exports](/example-redirect?exampleName=exports).
