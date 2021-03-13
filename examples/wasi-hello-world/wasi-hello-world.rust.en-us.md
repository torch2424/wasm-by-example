# WASI Hello World

## Overview

In this example, We will be writing "Hello world!" to both the console (`stdout`), and a newly created file `./hello-world.txt`. We highly reccomended that you have read the [WASI Introduction](/example-redirect?exampleName=wasi-introduction&programmingLanguage=all) before procedding with this example. You should install [wasmtime](https://wasmtime.dev/) as that is the WebAssembly runtime we will be using as our host. You should also ensure that Rust is installed using the rustup [rustup](https://rustup.rs/) tool.

This example will be similar to [WASI Tutorial on the wasmtime repo](https://github.com/bytecodealliance/wasmtime/blob/master/docs/WASI-tutorial.md).

---

## Implementation

First, we will generate a new executable with cargo:

```bash
$ cargo new --bin wasi_hello_world
$ cd wasi_hello_world
```

Then, we will open the `src/main.rs` and enter the following contents. Please see the comments to understand what our program will be doing:

```rust
// Import rust's io and filesystem module
use std::io::prelude::*;
use std::fs;

// Entry point to our WASI applications
fn main() {

  // Print out hello world!
  // This will handle writing to stdout for us using the WASI APIs (e.g fd_write)
  println!("Hello world!");

  // Create a file
  // We are creating a `helloworld.txt` file in the `/helloworld` directory
  // This code requires the Wasi host to provide a `/helloworld` directory on the guest.
  // If the `/helloworld` directory is not available, the unwrap() will cause this program to panic.
  // For example, in Wasmtime, if you want to map the current directory to `/helloworld`,
  // invoke the runtime with the flag/argument: `--mapdir /helloworld::.`
  // This will map the `/helloworld` directory on the guest, to  the current directory (`.`) on the host
  let mut file = fs::File::create("/helloworld/helloworld.txt").unwrap();

  // Write the text to the file we created
  write!(file, "Hello world!\n").unwrap();
}
```

As mentioned in the code comments, even though the [WASI APIs](https://github.com/WebAssembly/WASI/blob/master/phases/snapshot/docs.md) are not being used directly, when we compile our program to WASI, the rust APIs will be using these WASI APIs under the hood for us.

Next, we will want to add WASI as a target that we can compile to. We will ask the rustup tool to install support for WASI. Then, we will compile our program to WASI. To do this we will run:

```bash
$ rustup target add wasm32-wasi
$ cargo build --target wasm32-wasi
```

Our wasm file should be compiled to `target/wasm32-wasi/debug/wasi_hello_world.wasm`. And now we can actually run our program!

To do this, we can use the Wasmtime CLI, which we mentioned should be installed at the beginning of this tutorial. However, there is one thing to note that was mentioned in the code comments. **We need to give our program explicit access to create files on our host, because our program creates a new file**. As mentioned in the [WASI Introduction](/example-redirect?exampleName=wasi-introduction), our guest will not have this capability unless we give them the capability.

To grant the capability to write in a directory using the Wasmtime CLI, we need to use the `--mapdir` flag. `--mapdir` will allow us to map the `/helloworld` directory on the guest's virtual filesystem, to the current directory (`.`) on the host fileystem. For example:

```bash
wasmtime --mapdir GUEST_DIRECTORY::HOST_DIRECTORY my-wasi-program.wasm
```

So, **to run our compiled WASI program, we will run**:

```bash
wasmtime --mapdir /helloworld::. target/wasm32-wasi/debug/wasi_hello_world.wasm
```

You should then see "Hello World!" logged in your terminal. You should also notice that a `helloworld.txt` file was created in your current directory, with the contents of "Hello World!".

Yay! We have successfully written our first WASI module.

---

WASI is still growing, and there are a lot of projects that are taking advantages of WASI to do interesting things! You can see some examples of projects written for, or ported to WebAssembly using WASI, by searching "WASI" on [Made with WebAssembly](https://madewithwebassembly.com/). If you wanted to learn more about Rust and WASI at a hostcall level, here is a [great tutorial by Jakub Konka](http://www.jakubkonka.com/2020/04/28/rust-wasi-from-scratch.html).

Feel free to [fix, suggest, or contribute more examples](https://github.com/torch2424/wasm-by-example)!
