# 导入 Javascript 函数到 WebAssembly

## 概览

在实例化 Wasm 模块时可以传递一个 [`importObject`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiateStreaming) 参数，这个 `importObject` 可以用于在 Wasm 中调用宿主（Javascript 侧）的函数。

在 rust 中可以使用 [wasm-bindgen](https://github.com/rustwasm/wasm-bindgen)，它作为 wasm-pack 工作流的一部分提供了对于 `importObject` 的抽象封装。

在这个例子中我们导入并实现了一个简单的 `console.log` 并在 wasm 中调用。这个例子受到来自 [console_log example](https://github.com/rustwasm/wasm-bindgen/blob/master/examples/console_log/src/lib.rs) 的启发，并在此基础上进行了简化。接下来看看例子：

---

## 实现

首先在 `src/lib.rs` 中编写以下代码：

```rust
// wasm-pack 使用 wasm-binden 来生成 JavaScript binding 文件.
// 导入 wasm-bindgen crate.
use wasm_bindgen::prelude::*;

// 定义从 JavaScript 导入的外部函数 `console.log`
#[wasm_bindgen]
extern "C" {
  // 这里要在 log(..) 前使用 `js_namespace` 来绑定 `console.log(..)`
#[wasm_bindgen(js_namespace = console)]
  fn log(s: &str);
}

// 导出可以被 JavaScript 侧调用的函数
// 内部则会调用从 JavaScript 导入的 console.log
#[wasm_bindgen]
pub fn console_log_from_wasm() {
  log("This console.log is from wasm!");
}
```

然后使用 [wasm-pack](https://github.com/rustwasm/wasm-pack) 编译、生成 `pkg/` 目录。

```bash
wasm-pack build --target web
```

新建 `index.js` 文件来加载和运行我们的 wasm 产物。从 `pkg/importing_javascript_functions_into_webassembly.js` 导入 wasm-pack 生成的 wasm 初始化模块。然后传入路径来调用 wasm-pack 生成的 `pkg/importing_javascript_functions_into_webassembly_bg.wasm` 文件。现在就可以调用先前导出的 wasm 函数，其内部会去调用 rust 侧导入的 JavaScript 函数 `console.log`。

> **注意：**为了便于理解 WebAssembly API 的使用方式，这个例子我们直接从 wasm 模块导出并使用函数。不过实际上 `wasm-bindgen` 会自动生成 JavaScript bindings 代码，可以直接使用 ES6 import 语句来导入并使用。这些 JavaScript binding 将在 “使用 `wasm-bindgen` 传递高级数据类型” 章节详细展示。

```javascript
const runWasm = async () => {
  // 实例化 wasm 模块
  const rustWasm = await wasmInit(
    "./pkg/importing_javascript_functions_into_webassembly_bg.wasm"
  );

  // 运行其导出的函数
  rustWasm.console_log_from_wasm(); // 打印输出 "This console.log is from wasm!"
};
runWasm();
```

Lastly, lets load our ES6 Module, `index.js` Javascript file in our `index.html`. And you should get something similar to the demo ([Source Code](/source-redirect?path=examples/importing-javascript-functions-into-webassembly/demo/rust)) below!

最后只需在 `index.html` 中导入编写好的 `index.js` 代码模块。最终的结果可以参考以下 demo 的 ([源码](/source-redirect?path=examples/importing-javascript-functions-into-webassembly/demo/rust))。

---

## Demo

<iframe title="Rust Demo" src="/demo-redirect?example-name=importing-javascript-functions-into-webassembly"></iframe>

以上就是 wasm 的基础内容。接下来我们将通过例子 [Reading and Writing Graphics with WebAssembly](/example-redirect?exampleName=reading-and-writing-graphics) 学习一些进阶示例。
