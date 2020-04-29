# Hello World!

**Before getting started, be sure to check out all of the languages available, by clicking the "languages" dropdown in the header.**

## Overview

For our first program, we will be doing a "Hello world" type of program in [Golang (Go)](https://golang.org/), using the [TinyGo Compiler](https://tinygo.org/). Go is a popular open source general purpose programming language. TinyGo is a compiler based on [LLVM](https://llvm.org/), that helps bring Go to embedable devices int the IoT space like microcontrollers. [WebAssembly support in the Go ecosystem](https://github.com/golang/go/wiki/WebAssembly) is still a bit young. For example, Wasm modules tend to be a bit large and support for new Wasm specifications like the [WebAssembly System Interface (WASI)](https://github.com/golang/go/issues/31105) are bit behind, compared to other mature WebAssembly toolchains. To help with our Wasm module sizes, we are using TinyGo, as this will generate much smaller Wasm modules, at the expense of some missing or incomplete features from the Go stdlib.

To keep things simple with Wasm's limitations mentioned [in the introduction example](/example-redirect?exampleName=introduction&programmingLanguage=all), instead of displaying a string, we will add two numbers together and display the result. Though, it is good to keep in mind, in later examples, a lot of these limitations will be abstracted away by your WebAssembly Language of choice (In this case, AssemblyScript).

---

## Implementation

And we should have a working Wasm Add (Hello World) program! Congrats!

You should have something similar to the demo ([Source Code](/source-redirect?path=examples/hello-world/demo/go)) below:

## Demo

<iframe title="Go Demo" src="/demo-redirect?example-name=hello-world"></iframe>

Before moving on it would be good to note, another great resource for learning TinyGo Wasm by example is taking a look at the official [TinyGo Wasm examples](https://github.com/tinygo-org/tinygo/tree/master/src/examples/wasm). As well as, the [TinyGo Wasm Documentation](https://tinygo.org/webassembly/webassembly/).

Next, continuing on with WasmByExample, let's take a deeper look at WebAssembly [Exports](/example-redirect?exampleName=exports).
