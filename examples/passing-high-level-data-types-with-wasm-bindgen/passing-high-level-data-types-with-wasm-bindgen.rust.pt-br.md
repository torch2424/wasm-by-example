# Passando Tipos de Dados de Alto Nível com o `wasm-bindgen`

## Visão Geral

Usando buffers e ponteiros é um ótimo jeito de começar a testar o WebAssembly, se aprofundar nos conceitos e, ao mesmo tempo, ser produtivo. Mas a partir do momento em que quisermos usar estruturas de nível mais alto com eficiência e facilidade as coisas podem se complicar um pouco. Felizmente, a comunidade do rust/wasm criou o [wasm-bindgen](https://github.com/rustwasm/wasm-bindgen), que é uma parte do fluxo de trabalho do wasm-pack, que estivemos usando en nossos exemplos. Como mencionado anteriormente, o wasm-bindgen abstrai a partir da memória linear e nos permite usar estruturas de nível mais alto entre o Rust e o JavaScript.

Vamos iniciar as coisas! Para exibir como podemos usar o `wasm-bindgen`, vejamos como podemos usar as strings em WebAssembly e compartilhá-las com o Javascript:

---

## Implementação

Primeiro, vamos adicionar o seguinte conteúdo no nosso arquivo `src/lib.rs`:

```rust
// The wasm-pack uses wasm-bindgen to build and generate JavaScript binding file.
// Import the wasm-bindgen crate.
use wasm_bindgen::prelude::*;

// Our function to concatenate the string "Wasm by Example"
// to the input string. We are using .into(), to convert
// the rust types of str to a String.
#[wasm_bindgen]
pub fn add_wasm_by_example_to_string(input_string: String) -> String {
  let result = format!("{} {}", input_string, "Wasm by Example");
  return result.into();
}
```

Depois, podemos compilar o módulo seguindo os mesmos passos de compilação do exemplo de [Olá, Mundo](/example-redirect?exampleName=hello-world), substituindo os nomes de arquivos quando apropriado.

A seguir, criamos um arquivo `index.js` para carregar e rodar o nosso módulo wasm. Agora que estamos usando as estruturas de dados de mais alto nível, iremos aproveitar os exports com nome no nosso `./pkg/strings.js`. **Os exports com nome gerados pelo wasm-pack no nosso `./pkg/strings.js` são funções que envolvem as nossas funções wasm exportadas e assim lidar com a passagem de dados, facilitando a passagem das estruturas de mais alto nível entre o WebAssembly e o JavaScript**. No nosso caso, podemos dar uma olhada no tipo suportado [String wasm-bindgen](https://rustwasm.github.io/docs/wasm-bindgen/reference/types/string.html). No futuro, você pode usar este recurso para ver outros tipos suportados bem como o usá-los. Vamos ver os detalhes do nosso `index.js` resultante:

```javascript
// Here we are importing the default export from our
// Outputted wasm-bindgen ES Module. As well as importing
// the named exports that are individual wrapper functions
// to facilitate handle data passing between JS and Wasm.
import wasmInit, {
  add_wasm_by_example_to_string,
  test
} from "./pkg/strings.js";

const runWasm = async () => {
  // Instantiate our wasm module
  const rustWasm = await wasmInit("./pkg/strings_bg.wasm");

  // Call our exported function
  const helloString = add_wasm_by_example_to_string("Hello from ");

  // Log the result to the console
  console.log(helloString);
};
runWasm();
```

Por último, vamos carregar o nosso Módulo ES6, o arquivo Javascript `index.js` no nosso `index.html`. E você deveria obter um resultado parecido à demo ([Código Fonte](/source-redirect?path=examples/passing-high-level-data-types-with-wasm-bindgen/demo/rust)) abaixo!

---

## Demo

<iframe width="350px" height="200px" title="Rust Demo" src="/demo-redirect?example-name=passing-high-level-data-types-with-wasm-bindgen"></iframe>

---

**O [wasm-bindgen](https://github.com/rustwasm/wasm-bindgen) suporta mais apenas strings, e tem suporte para muito tipos diferentes!** É altamente recomendável dar uma olhada no [livro wasm-bindgen](https://rustwasm.github.io/docs/wasm-bindgen/), em particular a seção dos [tipos suportados pelo wasm-bindgen](https://rustwasm.github.io/docs/wasm-bindgen/reference/types.html).

Sinta-se à vontade para [corrigir, sugerir, ou contribuir com mais exemplos de funcionalidades ou ferramentas da comunidade](https://github.com/torch2424/wasm-by-example)!
