# Exports

## Overview

In our [Hello World Example](/example-redirect?exampleName=hello-world), we called a function exported from WebAssembly, in our Javascript. **However, you can export both functions and constants to Javascript**. Let's dive a little deeper into exports and how they are used.

---

## Implementation

So first, let's create our `exports.ts` AssemblyScript file:

```typescript
// This exports an add function.
// It takes in two 32-bit integer values
// And returns a 32-bit integer value.
export function callMeFromJavascript(a: i32, b: i32): i32 {
  return addIntegerWithConstant(a, b);
}

// This exports a 32-bit integer constant
export const GET_THIS_CONSTANT_FROM_JAVASCRIPT: i32 = 2424;

// A NOT exported function
// It takes in two 32-bit integer values
// And returns a 32-bit integer value.
function addIntegerWithConstant(a: i32, b: i32): i32 {
  return a + b + ADD_CONSTANT;
}

// A NOT export constant
// a 32-bit integer constants
const ADD_CONSTANT: i32 = 1;
```

Then, let's compile that into a wasm module, using the [AssemblyScript Compiler](https://github.com/AssemblyScript/assemblyscript/wiki/Using-the-compiler), which will output a `export-function.wasm`:

```bash
asc exports.ts -b exports.wasm
```

Next, Let's load / instantiate the wasm module, `export-function.wasm` in a new `export-function.js` file. Looking at the [WebAssembly Module Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/WebAssembly/Module), We see that after instantiation of our module, our Module has a `.instance` property, which is a [WebAssembly Module Instance](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/WebAssembly/Instance). An example of instantiating a module can be found in the [Hello World Example](/example-redirect?exampleName=hello-world). Lastly, we see that our instance has an `.exports` property. The `.exports` property is an object that contains all of the exported functions / constants, that be called / accessed synchronously from Javascript. Functions can be called with normal function syntax, whereas constants require accessing them with `.valueOf()` depending on if they are exports as [WebAssembly Globals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Global). See the snippet below:

```javascript
const runWasm = async () => {
  // Instantiate our wasm module
  const wasmModule = await wasmBrowserInstantiate("hello-world.wasm");

  // Get our exports object, with all of our exported Wasm Properties
  const exports = wasmModule.instance.exports;

  console.log(exports.callMeFromJavascript(24, 24)); // Logs 49

  // Since our constant is a global we use `.valueOf()`.
  // Though, in some cases this could simply be: exports.GET_THIS_CONSTANT_FROM_JAVASCRIPT
  console.log(exports.GET_THIS_CONSTANT_FROM_JAVASCRIPT.valueOf()); // Logs 2424

  // Trying to access a property we did NOT export
  console.log(exports.addIntegerWithConstant); // Logs undefined
};
runWasm();
```

Lastly, lets load our ES6 Module, `exports.js` Javascript file in our `index.html`. And you should get something similar to the demo ([Source Code](/source-redirect?path=examples/exports/demo/assemblyscript)) below!

---

## Demo

<iframe title="AssemblyScript Demo" src="/examples/exports/demo/assemblyscript/"></iframe>

Next let's take a look at [WebAssembly Linear Memory](/example-redirect?exampleName=webassembly-linear-memory).
