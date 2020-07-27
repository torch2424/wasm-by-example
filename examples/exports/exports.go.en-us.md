# Exports

## Overview

In our [Hello World Example](/example-redirect?exampleName=hello-world), we called a function exported from WebAssembly, in our Javascript. Let's dive a little deeper into exports and how they are used.

---

## Implementation

If you haven't done so already, you should set up your project following the steps laid out in the [Hello World Example](/example-redirect?exampleName=hello-world) example.

First, let's add the following to our `main.go` file:

```go
package main

// Declare a main function, this is the entrypoint into our go module
// That will be run. In our example, we won't need this
func main() {}

// This exports an add function.
// It takes in two 32-bit integer values
// And returns a 32-bit integer value.
// To make this function callable from JavaScript,
// we need to add the: "export myFunctionName" comment above the function
//export callMeFromJavascript
func callMeFromJavascript(x int, y int) int {
  return addIntegerWithConstant(x, y);
}

// A NOT exported constant
// Go does not support exporting constants
// for Wasm (that I know of).
var ADD_CONSTANT int = 24;

// A NOT exported function
// It takes in two 32-bit integer values
// And returns a 32-bit integer value.
func addIntegerWithConstant(x int, y int) int {
  return x + y + ADD_CONSTANT;
}
```

Then, let's compile `main.go` into a wasm module, using the TinyGo compiler. This will output a `main.wasm`:

```bash
tinygo build -o main.wasm -target wasm ./main.go
```

---

Then, let's create an `index.html`, and get our appropriate `wasm_exec.js` following the steps laid out in the [Hello World Example](/example-redirect?exampleName=hello-world) example.

---

Lastly, lets create our `index.js` JavaScript file. We will be using the same `wasmBrowserInstantiate` as mentioned in the [Hello World Example](/example-redirect?exampleName=hello-world) example:

```javascript
const go = new Go(); // Defined in wasm_exec.js. Don't forget to add this in your index.html.

const runWasm = async () => {
  // Get the importObject from the go instance.
  const importObject = go.importObject;

  // Instantiate our wasm module
  const wasmModule = await wasmBrowserInstantiate("./main.wasm", importObject);

  // Allow the wasm_exec go instance, bootstrap and execute our wasm module
  go.run(wasmModule.instance);

  // Call the Add function export from wasm, save the result
  const result = wasmModule.instance.exports.callMeFromJavascript(24, 24);

  console.log(result);
  console.log(wasmModule.instance.exports.ADD_CONSTANT); // Should return undefined
  console.log(wasmModule.instance.exports.addIntegerWithConstant); // Should return undefined
};
runWasm();
```

And that should be it! You should have something similar to the demo ([Source Code](/source-redirect?path=examples/exports/demo/go)) below:

---

## Demo

<iframe title="Go Demo" src="/demo-redirect?example-name=exports"></iframe>

Next let's take a look at [WebAssembly Linear Memory](/example-redirect?exampleName=webassembly-linear-memory).
