# Hello World!

**Before getting started, be sure to check out all of the languages available, by clicking the "languages" dropdown in the header.**

## Overview

For our first program, we will be doing a "Hello world" type of program in [Golang (Go)](https://golang.org/), using the [TinyGo Compiler](https://tinygo.org/). Go is a popular open source general purpose programming language. TinyGo is a compiler based on [LLVM](https://llvm.org/), that helps bring Go to embedable devices int the IoT space like microcontrollers. [WebAssembly support in the Go ecosystem](https://github.com/golang/go/wiki/WebAssembly) is still a bit young (as of July, 2021). For example, Wasm modules tend to be a bit large and support for new Wasm specifications like the [WebAssembly System Interface (WASI)](https://github.com/golang/go/issues/31105) are bit behind, compared to other mature WebAssembly toolchains. To help with our Wasm module sizes, we are using TinyGo, as this will generate much smaller Wasm modules, at the expense of some missing or incomplete features from the Go stdlib. To see a list of the supported stdlib by TinyGo, please visit the [language support section in the TinyGo documentation](https://tinygo.org/docs/reference/lang-support/).

To keep things simple with Wasm's limitations mentioned [in the introduction example](/example-redirect?exampleName=introduction&programmingLanguage=all), instead of displaying a string, we will add two numbers together and display the result. Though, it is good to keep in mind, in later examples, a lot of these limitations will be abstracted away by your WebAssembly Language of choice (In this case, Go).

---

## Implementation

First, we should [install Go](https://golang.org/doc/install) and [install TinyGo](https://tinygo.org/getting-started/).

After this, we can create a `main.go` file:

```go
package main

// Declare a main function, this is the entrypoint into our go module
// That will be run. In our example, we won't need this
func main() {}


// This exports an add function.
// It takes in two 32-bit integer values
// And returns a 32-bit integer value.
// To make this function callable from JavaScript,
// we need to add the: "export add" comment above the function
//export add
func add(x int, y int) int {
  return x + y;
}
```

Then, let's compile `main.go` into a wasm module, using the TinyGo compiler. This will output a `main.wasm`:

```bash
tinygo build -o main.wasm -target wasm ./main.go
```

Then, let's create an `index.html` that we can use to load our project in the browser:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Hello World - Go</title>
  </head>
  <body>
    <!-- 
    The wasm_exec.js must come before our Javascript (index.js), 
    as it defines some global objects 
    -->
    <script src="./wasm_exec.js"></script>
    <script type="module" src="./index.js"></script>
  </body>
</html>
```

In this HTML, we are loading an `index.js` (which we will create in the next step), but before we load that `index.js`, we load a `wasm_exec.js`. **You must add the `wasm_exec.js` to use Go wasm modules in the browser**! To add this file, [You can get the `wasm_exec.js` from your TinyGo root](https://tinygo.org/docs/guides/webassembly/wasm/#how-it-works). An easy way to do this, as described in [this issue](https://github.com/tinygo-org/tinygo/issues/1070), is to run:

```bash
cp $(tinygo env TINYGOROOT)/targets/wasm_exec.js .
```

It is also very important to notice: **Your wasm_exec.js must match the TinyoGo compiler version, of the TinyGo compiler that compiled your Tiny Go Wasm module**. Therefore, you should update `wasm_exec.js` whenever you update your TinyGo compiler.

Lastly, lets create our `index.js` JavaScript file. In our `index.js`, add a function for loading Wasm modules using the [WebAssembly Web APIs](https://developer.mozilla.org/en-US/docs/WebAssembly):

```javascript
// https://github.com/torch2424/wasm-by-example/blob/master/demo-util/
export const wasmBrowserInstantiate = async (wasmModuleUrl, importObject) => {
  let response = undefined;

  // Check if the browser supports streaming instantiation
  if (WebAssembly.instantiateStreaming) {
    // Fetch the module, and instantiate it as it is downloading
    response = await WebAssembly.instantiateStreaming(
      fetch(wasmModuleUrl),
      importObject
    );
  } else {
    // Fallback to using fetch to download the entire module
    // And then instantiate the module
    const fetchAndInstantiateTask = async () => {
      const wasmArrayBuffer = await fetch(wasmModuleUrl).then(response =>
        response.arrayBuffer()
      );
      return WebAssembly.instantiate(wasmArrayBuffer, importObject);
    };

    response = await fetchAndInstantiateTask();
  }

  return response;
};
```

After we added our function for instantiating wasm modules, we can use our wasm module by adding the following code in `index.js`:

```javascript
const go = new Go(); // Defined in wasm_exec.js. Don't forget to add this in your index.html.

const runWasmAdd = async () => {
  // Get the importObject from the go instance.
  const importObject = go.importObject;

  // Instantiate our wasm module
  const wasmModule = await wasmBrowserInstantiate("./main.wasm", importObject);

  // Allow the wasm_exec go instance, bootstrap and execute our wasm module
  go.run(wasmModule.instance);

  // Call the Add function export from wasm, save the result
  const addResult = wasmModule.instance.exports.add(24, 24);

  // Set the result onto the body
  document.body.textContent = `Hello World! addResult: ${addResult}`;
};
runWasmAdd();
```

And we should have a working Wasm Add (Hello World) program! Congrats!

You should have something similar to the demo ([Source Code](/source-redirect?path=examples/hello-world/demo/go)) below:

## Demo

<iframe title="Go Demo" src="/demo-redirect?example-name=hello-world"></iframe>

Before moving on it would be good to note, another great resource for learning TinyGo Wasm by example is taking a look at the official [TinyGo Wasm examples](https://github.com/tinygo-org/tinygo/tree/master/src/examples/wasm). As well as, the [TinyGo Wasm Documentation](https://tinygo.org/docs/guides/webassembly/wasm/).

Next, continuing on with WasmByExample, let's take a deeper look at WebAssembly [Exports](/example-redirect?exampleName=exports).
