# Importing Javascript Functions Into WebAssembly

## Overview

When you are instantiating Wasm modules, you are able to pass in an [`importObject`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiateStreaming). This `importObject` can be used to call host (Javascript) functions within Wasm! In this example, we will import and implement a simple console.log, which is called within Wasm:

---

## Implementation

If you haven't done so already, you should set up your project following the steps laid out in the [Hello World Example](/example-redirect?exampleName=hello-world) example.

First, let's add the following to our `main.go` file:

```go
package main

// Declare a function however do no give it a block of functionality.
// We will be overriding this function in our javascript later so that
// it calls our imported function
func jsPrintInt(x int)

// Declare a main function, this is the entrypoint into our go module
// That will be run. We could just call out log function from here, but
// going to export a function :)
func main() {}

// Export a function that takes in an integer
// and calls an imported function from the importObject
// to log out that integer, back inside of JavaScript
//export printIntFromWasm
func printIntFromWasm(x int) {
  jsPrintInt(x)
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

  // Set our function we want to use from WebAssembly, on our importObject
  // This should be set on the env key, of the import object.
  // The function itself should be set on the env object, where the key is
  // depending on the compiler, usually in the format similar to below,
  // but you can check for the "LinkError: WebAssembly.instantiate()",
  // which would show the name required.
  importObject.env["./main.go.jsPrintInt"] = value => console.log(value);

  // Instantiate our wasm module
  const wasmModule = await wasmBrowserInstantiate("./main.wasm", importObject);

  // Allow the wasm_exec go instance, bootstrap and execute our wasm module
  go.run(wasmModule.instance);

  // Call the export from wasm
  wasmModule.instance.exports.printIntFromWasm(24);
};
runWasm();
```

---

## Demo

<iframe title="Go Demo" src="/demo-redirect?example-name=importing-javascript-functions-into-webassembly"></iframe>

And that's it for the basics! We will be adding the "Advanced Web Demos" for Go a bit later. However, Feel free to [fix, suggest, or contribute more examples](https://github.com/torch2424/wasm-by-example)!
