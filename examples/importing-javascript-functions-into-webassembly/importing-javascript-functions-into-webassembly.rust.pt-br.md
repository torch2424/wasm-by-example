# Como Importar Funções do Javascript Em WebAssembly

## Visão Geral

Quando você está instanciando módulos do Wasm, você é capaz de lhes passar um [`importObject`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiateStreaming). Este `importObject` pode ser usado para invocar funções do host (Javascript) dentro do Wasm!

Em rust, as ferramentas tipo o [wasm-bindgen](https://github.com/rustwasm/wasm-bindgen), que é parte do fluxo de trabalho do wasm-pack, abstraem o `importObject`.

Neste exemplo, iremos importar e implementar um simples `console.log` que será invocado dentro do Wasm. Este exemplo foi inspirado pelo [exemplo de console_log](https://github.com/rustwasm/wasm-bindgen/blob/master/examples/console_log/src/lib.rs), mas simplificado. Assim que vamos direto ao exemplo:

---

## Implementação

Primeiro, vamos adicionar o seguinte ao nosso arquivo `src/lib.rs`:

```rust
// The wasm-pack uses wasm-bindgen to build and generate JavaScript binding file.
// Import the wasm-bindgen crate.
use wasm_bindgen::prelude::*;

// Let's define our external function (imported from JS)
// Here, we will define our external `console.log`
#[wasm_bindgen]
extern "C" {
  // Use `js_namespace` here to bind `console.log(..)` instead of just
  // `log(..)`
#[wasm_bindgen(js_namespace = console)]
  fn log(s: &str);
}

// Export a function that will be called in JavaScript
// but call the "imported" console.log.
#[wasm_bindgen]
pub fn console_log_from_wasm() {
  log("This console.log is from wasm!");
}
```

Então, vamos compilá-lo usando o [wasm-pack](https://github.com/rustwasm/wasm-pack), que vai criar um diretório `pkg/`:

```bash
wasm-pack build --target web
```

A seguir, criamos um arquivo `index.js` que carrega e roda o nosso wasm gerado. Importamos o módulo de inicialização do wasm `pkg/importing_javascript_functions_into_webassembly.js` que também foi gerado pelo wasm-pack. Então, invocamos o módulo passando a localização do nosso arquivo wasm `pkg/importing_javascript_functions_into_webassembly_bg.wasm`, mais uma vez gerado pelo wasm-pack. Então, vamos em frente e invocamos a nossa função exportada pelo wasm, que por sua vez invoca a função Javascript `console.log` que foi "importada":

```javascript
const runWasm = async () => {
  // Instantiate our wasm module
  const rustWasm = await wasmInit(
    "./pkg/importing_javascript_functions_into_webassembly_bg.wasm"
  );

  // Run the exported function
  rustWasm.console_log_from_wasm(); // Should log "This console.log is from wasm!"
};
runWasm();
```

Por último, carregamo o nosso Módulo ES6, o arquivo Javascript `index.js` no nosso `index.html`. E você deveria obter um resultado similar à demo ([Código Fonte](/source-redirect?path=examples/importing-javascript-functions-into-webassembly/demo/rust)) abaixo!

---

## Demo

<iframe title="Rust Demo" src="/demo-redirect?example-name=importing-javascript-functions-into-webassembly"></iframe>

E pronto, isso é tudo para cobrir o básico! A seguir, vamos dar uma olhada em algumas "Demos Web Avançadas", com um exemplo de [Como Ler e Escrever Gráficos com o WebAssembly](/example-redirect?exampleName=reading-and-writing-graphics).
