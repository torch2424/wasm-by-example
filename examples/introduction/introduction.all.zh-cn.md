# 介绍

首先来简单介绍下 WebAssembly 当中的主要概念：

- WebAssembly 语言通常作为编译的结果，用于在 web 上运行字节码。
- 相较于 Javascript，WebAssembly 能提供更可预测的性能。它本身并不比 JavaScript 更快，但在正确的使用情况下，例如进行 **计算密集型任务**，比如循环嵌套或处理大量数据时，**WebAssembly 可能会更快**。因此 **WebAssembly 是 JavaScript 的补充而不是替代**。
- WebAssembly 具有优秀的可移植性。它可以运行在所有主流 web 浏览器、类似 [Node.js](https://nodejs.org/en/) 的 V8 运行时、或者包括 [Wasmtime](https://wasmtime.dev/)、[Lucet](https://github.com/bytecodealliance/lucet) 以及 [Wasmer](https://github.com/wasmerio/wasmer) 等在内的独立 Wasm 运行时。
- WebAssembly 具有线性的内存模型，可以理解为一个巨大可拓展的数组。也因此在 Javascript 环境中 Javascript 和 Wasm 都可以直接同步访问。
- WebAssembly 可以导出函数和常量，也因此在 Javascript 环境中 Javascript 和 Wasm 都可以直接同步访问。
- WebAssembly 在当前的 MVP 版本中只能处理整型和浮点数，但是有一些工具和库可以方便地传递高级数据类型。

接下来请查看 [Hello World](/example-redirect?exampleName=hello-world) 来上手这些概念。
