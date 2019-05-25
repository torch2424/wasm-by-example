# Hello World!

**Before getting started with AssemblyScript and Wasm, be sure to check out all of the languages available, by clicking the "languages" link in the header.**

## Overview

For our first program, we will be doing a "Hello world" type of program in [AssemblyScript](https://github.com/AssemblyScript/assemblyscript). AssemblyScript, is essentially a TypeScript to WebAssembly compiler. This is great for TypeScript and JavaScript developers who want to write WebAssembly, without learning a new language. Though, to be clear, you can not compile our TypeScript React apps to WebAssembly with AssemblyScript because of its differences from TypeScript. But is still a great language for building WebAssembly applications.

To keep things simple with Wasm's limitations mentioned [in the introduction example](/example-redirect?exampleName=introduction&programmingLanguage=all), instead of displaying a string, we will add two numbers together and display the result. Though, it is good to keep in mind, in later examples, a lot of these limitations will be abstracted away by your WebAssembly Language of choice (In this case, AssemblyScript).

---

## Implementation

So first, let's create our `hello-world.ts` AssemblyScript file:

```typescript
// This exports an add function.
// It takes in two 32-bit integer values
// And returns a 32-bit integer value.
export function add(a: i32, b: i32): i32 {
  return a + b;
}
```

Then, let's compile that into a wasm module, using the [AssemblyScript Compiler](https://github.com/AssemblyScript/assemblyscript/wiki/Using-the-compiler), which will output a `hello-world.wasm`:

```bash
asc hello-world.ts -b hello-world.wasm
```

Next, lets create a `hello-world.js` JavaScript file, and add a function for loading Wasm modules:

```javascript
// https://github.com/torch2424/wasm-by-example/blob/master/demo-util/
const importObject = {};
export const wasmBrowserInstantiate = async wasmModuleUrl => {
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

Next, Lets use the above Javascript function from `hello-world.js` to load and instantiate our wasm module, `hello-world.wasm`. Then, continuing with `hello-world.js`, we will call our exported `add()` function from our Wasm module:

```javascript
const runWasmAdd = async () => {
  // Instantiate our wasm module
  const wasmModule = await wasmBrowserInstantiate("hello-world.wasm");

  // Call the Add function export from wasm, save the result
  const addResult = wasmModule.instance.exports.add(24, 24);

  // Set the result onto the body
  document.body.textContent = `Hello World! addResult: ${addResult}`;
};
runWasmAdd();
```

Lastly, lets load our ES6 Module, `hello-world.js` Javascript file in our `index.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Hello World - AssemblyScript</title>
    <script type="module" src="./hello-world.js"></script>
  </head>
  <body></body>
</html>
```

And we should have a working Wasm Add (Hello World) program! Congrats!

## Demo

<iframe src="/examples/hello-world/demo/assemblyscript/"></iframe>
