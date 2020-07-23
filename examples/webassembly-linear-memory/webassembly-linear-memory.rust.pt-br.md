# A Memória Linear do WebAssembly

## Visão Geral

Outra funcionalidade do WebAssembly é a memória linear. A memória linear é um faixa contínua de bytes sem sinal que podem ser lidos e escritos tanto pelo Wasm como pelo Javascript. Em outras palavras, a memória do Wasm é uma matriz expansível de bytes que podem ser lidas e modificadas de forma síncrona. A memória linear pode ser usada para muitas coisas, uma delas é passar valores de lá para cá e de cá para lá entre o Wasm e o Javascript.

Em rust, as ferramentas como o [wasm-bindgen](https://github.com/rustwasm/wasm-bindgen), que é parte do fluxo de trabalho do wasm-pack, abstraem o uso da memória linear, e permite usar estruturas de dados nativas entre o rust e o Javascript. Mas neste exemplo vamos usar espaços de memória e ponteiros (índices de matrix de memória do Wasm) de um único byte (um inteiro de 8-bit sem sinal) como uma maneira mais simples de movimentar a memória e exibir o conceito.

Vejamos como podemos usar a memória linear:

---

## Implementação

Primeiro, adicionamos o seguinte ao arquivo `src/lib.rs`:

```rust
// The wasm-pack uses wasm-bindgen to build and generate JavaScript binding file.
// Import the wasm-bindgen crate.
use wasm_bindgen::prelude::*;

// Create a static mutable byte buffer.
// We will use for passing memory between js and wasm.
// NOTE: global `static mut` means we will have "unsafe" code
// but for passing memory between js and wasm should be fine.
const WASM_MEMORY_BUFFER_SIZE: usize = 2;
static mut WASM_MEMORY_BUFFER: [u8; WASM_MEMORY_BUFFER_SIZE] = [0; WASM_MEMORY_BUFFER_SIZE];

// Function to store the passed value at index 0,
// in our buffer
#[wasm_bindgen]
pub fn store_value_in_wasm_memory_buffer_index_zero(value: u8) {
  unsafe {
    WASM_MEMORY_BUFFER[0] = value;
  }
}

// Function to return a pointer to our buffer
// in wasm memory
#[wasm_bindgen]
pub fn get_wasm_memory_buffer_pointer() -> *const u8 {
  let pointer: *const u8;
  unsafe {
    pointer = WASM_MEMORY_BUFFER.as_ptr();
  }

  return pointer;
}

// Function to read from index 1 of our buffer
// And return the value at the index
#[wasm_bindgen]
pub fn read_wasm_memory_buffer_and_return_index_one() -> u8 {
  let value: u8;
  unsafe {
    value = WASM_MEMORY_BUFFER[1];
  }
  return value;
}
```

Então, compilamos com o [wasm-pack](https://github.com/rustwasm/wasm-pack), que vai criar um diretório `pkg/`:

```bash
wasm-pack build --target web
```

Depois, criamos um arquivo `index.js` para carregar e executar o wasm que foi gerado. E vamos importar o módulo de inicialização do `pkg/webassembly_linear_memory.js` que tambe ém foi gerado pelo wasm-pack. Então, vamos invocar o módulo passando a localização do nosso arquivo wasm `pkg/webassembly_linear_memory_bg.wasm`, também gerado pelo wasm-pack. A seguir, vamos ler e escrever na memória tanto a partir do Wasm como do JS. **Por favor leia os comentários para ter mais contexto. E não deixe de ler a nota no final deste exemplo de código.** Vamos nos aprofundar no nosso `index.js` final:

```javascript
const runWasm = async () => {
  const rustWasm = await wasmInit("./pkg/webassembly_linear_memory_bg.wasm");

  /**
   * Part one: Write in Wasm, Read in JS
   */
  console.log("Write in JS, Read in Wasm, Index 0:");

  // First, let's have wasm write to our buffer
  rustWasm.store_value_in_wasm_memory_buffer_index_zero(24);

  // Next, let's create a Uint8Array of our wasm memory
  let wasmMemory = new Uint8Array(rustWasm.memory.buffer);

  // Then, let's get the pointer to our buffer that is within wasmMemory
  let bufferPointer = rustWasm.get_wasm_memory_buffer_pointer();

  // Then, let's read the written value at index zero of the buffer,
  // by accessing the index of wasmMemory[bufferPointer + bufferIndex]
  console.log(wasmMemory[bufferPointer + 0]); // Should log "24"

  /**
   * Part two: Write in JS, Read in Wasm
   */
  console.log("Write in JS, Read in Wasm, Index 1:");

  // First, let's write to index one of our buffer
  wasmMemory[bufferPointer + 1] = 25;

  // Then, let's have wasm read index one of the buffer,
  // and return the result
  console.log(rustWasm.read_wasm_memory_buffer_and_return_index_one()); // Should log "25"

  /**
   * NOTE: if we were to continue reading and writing memory,
   * depending on how the memory is grown by rust, you may have
   * to re-create the Uint8Array since memory layout could change.
   * For example, `let wasmMemory = new Uint8Array(rustWasm.memory.buffer);`
   * In this example, we did not, but be aware this may happen :)
   */
};
runWasm();
```

Finalmente, vamos carregar o nosso Módulo ES6, o arquivo Javascript `index.js`, no nosso `index.html`. E você deveria obter um resultado similar à demo ([Código Fonte](/source-redirect?path=examples/webassembly-linear-memory/demo/rust)) abaixo!

---

## Demo

<iframe width="350px" height="200px" title="Rust Demo" src="/demo-redirect?example-name=webassembly-linear-memory"></iframe>

A seguir, vamos ver [como importar funçōes do JavaScript no WebAssembly](/example-redirect?exampleName=importing-javascript-functions-into-webassembly).
