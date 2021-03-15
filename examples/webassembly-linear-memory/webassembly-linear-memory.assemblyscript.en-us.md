# WebAssembly Linear Memory

## Overview

Another feature of WebAssembly, is its linear memory. Linear memory is a continuous buffer of unsigned bytes that can be read from and stored into by both Wasm and JavaScript. In other words, Wasm memory is an expandable array of bytes that JavaScript and Wasm can synchronously read and modify. Linear memory can be used for many things, one of them being passing values back and forth between Wasm and JavaScript.

In AssemblyScript, the [runtime](https://docs.assemblyscript.org/details/runtime) supports higher level data structures and types. For example, there is support for [Arrays](https://docs.assemblyscript.org/standard-library/array) in AssemblyScript's standard library. But for this example, we will use simple byte (Unsigned 8-bit integer) memory and pointers (Wasm memory array indexes) as a simple(r) way to pass memory back and forth. This is for several reasons:

1. Really early versions of AssemblyScript didn't have a Garbage Collector, as at the time it was not part of the spec.
2. Less early versions of AssemblyScript didn't have a runtime, but instead had allocators and manual memory management.
3. Most importantly, we want to show off the concept of linear memory very clearly, in a simple and concise way.

Since we are directly writing to memory in this example, and there exists a runtime in AssemblyScript, **be sure to take a look at the [`--memoryBase` flag in the AssemblyScript compiler](https://docs.assemblyscript.org/details/compiler)**. This flag controls where the AssemblyScript runtime will start writing memory. For example, if you wanted to reserve the first 100 bytes for your own manual memory usage, you could set `--memoryBase 100`. This way AssemblyScript will not write to the first 100 bytes, and only to location 100 and above.Or in other words, `--memoryBase` will allow you to reserve memory for your own manual memory management, and avoid memory being overriden by the AssemblyScript runtime in WebAssembly linear memory.

Let's see how we can use linear memory:

---

## Implementation

First, let's create our `index.ts` file:

```typescript
// Set up our memory
// By growing our Wasm Memory by 1 page (64KB)
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory#Examples
memory.grow(1);

// Store the value 24 at index 0
const index = 0;
const value = 24;
store<u8>(index, value);

// Export a function that will read wasm memory
// and return the value at index 1
export function readWasmMemoryAndReturnIndexOne(): i32 {
  // Read the value at indexOne
  let valueAtIndexOne = load<u8>(1);
  return valueAtIndexOne;
}
```

Then, let's compile that into a wasm module, using the [AssemblyScript Compiler](https://docs.assemblyscript.org/details/compiler), which will output a `index.wasm`:

```bash
asc index.ts -b index.wasm
```

Next, Let's load / instantiate the wasm module, `index.wasm` in a new `index.js` file. Looking at the [WebAssembly Module Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/WebAssembly/Module), We see that after instantiation of our module, our Module has a `.instance` property, which is a [WebAssembly Module Instance](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/WebAssembly/Instance). An example of instantiating a module can be found in the [Hello World Example](/example-redirect?exampleName=hello-world). Lastly, we see that our instance has an `.exports` property. The `.exports` property is an object that contains all of the exported functions / constants, as well as a `memory` object, that be called / accessed synchronously from JavaScript. In this example, we care about the `memory`. The `memory` object has a buffer as a property, such as `memory.buffer`. That can be used to construct a [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) using `new Uint8Array(memory.buffer)` that we can use to read and modify Wasm memory. We use a `Uint8Array`, because as we stated earlier, linear memory is untyped bytes, thus 8 bit integers give us the simplest way of accessing memory without assumptions. See the snippet below:

```javascript
const runWasm = async () => {
  // Instantiate our wasm module
  const wasmModule = await wasmBrowserInstantiate("index.wasm");

  // Get our exports object, with all of our exported Wasm Properties
  const exports = wasmModule.instance.exports;

  // Get our memory object from the exports
  const memory = exports.memory;

  // Create a Uint8Array to give us access to Wasm Memory
  const wasmByteMemoryArray = new Uint8Array(memory.buffer);

  // Let's read index zero from JS, to make sure Wasm wrote to
  // wasm memory, and JS can read the "passed" value from Wasm
  console.log(wasmByteMemoryArray[0]); // Should Log "24".

  // Next let's write to index one, to make sure we can
  // write wasm memory, and Wasm can read the "passed" value from JS
  wasmByteMemoryArray[1] = 25;
  console.log(exports.readWasmMemoryAndReturnIndexOne()); // Should Log "25"
};
runWasm();
```

Lastly, let's load our ES6 Module, `index.js` JavaScript file in an `index.html`. And you should get something similar to the demo ([Source Code](/source-redirect?path=examples/webassembly-linear-memory/demo/assemblyscript)) below!

---

## Demo

<iframe title="AssemblyScript Demo" src="/demo-redirect?example-name=webassembly-linear-memory"></iframe>

Next let's take a look at [importing JavaScript functions into WebAssembly](/example-redirect?exampleName=importing-javascript-functions-into-webassembly).
