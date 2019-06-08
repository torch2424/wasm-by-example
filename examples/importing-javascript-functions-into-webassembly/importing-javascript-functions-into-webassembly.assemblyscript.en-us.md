# Importing Javascript Functions Into WebAssembly

## Overview

When you are instantiating Wasm modules, you are able to pass in an [`importObject`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiateStreaming). This `importObject` can be used to call host (Javascript) functions within Wasm! In this example, we will do a simple console.log, which is called within Wasm:

---

## Implementation

First, let's start with our `index.ts`:

```typescript
// Declared `importObject` function
declare function consoleLog(arg0: i32): void;

// Log out the number 24
consoleLog(24);
```

Then, let's compile that into a wasm module, using the [AssemblyScript Compiler](https://github.com/AssemblyScript/assemblyscript/wiki/Using-the-compiler), which will output a `index.wasm`:

```bash
asc index.ts -b index.wasm
```

Next, Let's load / instantiate the was module, `index.wasm` in a new `index.js` file. The only difference here, compared to earlier examples, is that this time we will be passing in our `importObject` into our `wasmBrowserInstantiate`. This import object will have a property, `consoleLog`, which matches the declared function `consoleLog` in our `index.ts`. **Note:** for Assemblyscript version `0.7.0`, declared imports need to be wrapped in the `index` property of the `importObject`. In later versions of AssemblyScript this may change. But let's see the example below:

```javascript
const runWasm = async () => {
  // Instantiate our wasm module
  // And pass in a wasm module
  const wasmModule = await wasmBrowserInstantiate("index.wasm", {
    index: {
      consoleLog: value => console.log(value)
    }
  });
};
runWasm();
```

Lastly, lets load our ES6 Module, `index.js` Javascript file in our `index.html`. And you should get something similar to the demo ([Source Code](/source-redirect?path=examples/importing-javascript-functions-into-webassembly/demo/assemblyscript)) below!

---

## Demo

<iframe src="/examples/importing-javascript-functions-into-webassembly/demo/assemblyscript/"></iframe>

Next, lets took a look at an example of implementing [Graphics with WebAssembly](/example-redirect?exampleName=graphics).
