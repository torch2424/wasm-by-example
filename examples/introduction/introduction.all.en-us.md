# Introduction

Let's do a brief introduction into major concepts of WebAssembly:

- WebAssembly is a compile-targeted language for running bytecode on the web.
- Relative to Javascript, WebAssembly offers predictable performance. It is not inherently **faster** than Javascript, but it **can be faster than JavaScript** in the correct use case. Such as **computationally instensive tasks**, like nested loops or handling large amounts of data. Therefore, **WebAssembly is a compliment to JavaScript, and not a replacement**.
- WebAssembly runs on: all major web browsers, V8 runtimes like [Node.js](https://nodejs.org/en/), and independent Wasm runtimes like [Wasmer](https://github.com/wasmerio/wasmer).
- WebAssembly has Linear Memory, in other words, one big expandable array. And in the context of Javascript, synchronously accesible by Javascript and Wasm.
- WebAssembly can export functions and constants, And in the context of Javascript, synchronously accesible by Javascript and Wasm.
- WebAssembly, in its current MVP, only handles integers and floats.

With that, let's take a look at our [Hello World](/example-redirect?exampleName=hello-world) to see some of the concepts in action.
