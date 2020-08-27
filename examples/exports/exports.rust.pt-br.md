# Exports

## Visão Geral

No nosso [Exemplo de "Olá, Mundo"](/example-redirect?exampleName=hello-world), invocamos uma função exportada pelo WebAssembly, no nosso Javascript. Vamos nos aprofundar nos exports e em como usá-los.

---

## Implementação

Se você ainda não fez isso, você deveria configurar o seu projeto seguindo os passos definidos no exemplo [Olá Mundo](/example-redirect?exampleName=hello-world).

Primeiro, vamos adicionar o seguinte ao nosso archivo `src/lib.rs`:

```rust
// The wasm-pack uses wasm-bindgen to build and generate JavaScript binding file.
// Import the wasm-bindgen crate.
use wasm_bindgen::prelude::*;

// This exports an add function.
// It takes in two 32-bit integer values
// And returns a 32-bit integer value.
#[wasm_bindgen]
pub fn call_me_from_javascript(a: i32, b: i32) -> i32 {
  return add_integer_with_constant(a, b);
}

// A NOT exported constant
// Rust does not support exporting constants
// for Wasm (that I know of).
const ADD_CONSTANT: i32 = 24;

// A NOT exported function
// It takes in two 32-bit integer values
// And returns a 32-bit integer value.
fn add_integer_with_constant(a: i32, b: i32) -> i32 {
  return a + b + ADD_CONSTANT;
}
```

A seguir, vamos compilá-lo usando [wasm-pack](https://github.com/rustwasm/wasm-pack), que vai criar um diretório `pkg/`:

```bash
wasm-pack build --target web
```

Depois, vamos criar um arquivo `index.js` para carregar e executar o resultado em wasm. Vamos importar o módulo de inicialização do arquivo `pkg/exports.js`, que foi criado pelo wasm-pack. Então, vamos invocar o módulo passando a localização de nosso arquivo wasm `pkg/exports_bg.wasm`, também gerado pelo wasm-pack. Agora, vamos em frente e invocamos as funções exportadas, e exploramos quais funções NÃO foram exportadas:

```javascript
import wasmInit from "./pkg/exports.js";

const runWasm = async () => {
  // Instantiate our wasm module
  const rustWasm = await wasmInit("./pkg/exports_bg.wasm");

  // Call the Add function export from wasm, save the result
  const result = rustWasm.call_me_from_javascript(24, 24);

  console.log(result); // Should output '72'
  console.log(rustWasm.ADD_CONSTANT); // Should output 'undefined'
  console.log(rustWasm.add_integer_with_constant); // Should output 'undefined'
};
runWasm();
```

Por último, vamos carregar o nosso módulo ES6, o arquivo Javascript `index.js`, no nosso `index.html`. E você deveria ver algo similar à demo ([Código Fonte](/source-redirect?path=examples/exports/demo/rust)) abaixo!

---

## Demo

<iframe title="Rust Demo" src="/demo-redirect?example-name=exports"></iframe>

A seguir daremos uma olhada na [Memória Linear do WebAssembly](/example-redirect?exampleName=webassembly-linear-memory).
