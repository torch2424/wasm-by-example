# Olá, Mundo

**Antes de começar, lembre-se de conferir todas as linguagens disponíveis, clicando o seletor "Language" acima.**

## Visão Geral

Neste nosso primeiro programa, vamos praticar com um programa do estilo "Olá, Mundo" em [Rust](https://www.rust-lang.org/) e [wasm-pack](https://github.com/rustwasm/wasm-pack).

Para manter as coisas simples, tendo em conta as limitações mencionadas [na introdução](/example-redirect?exampleName=introduction&programmingLanguage=all), em vez de mostrar um texto, iremos adicionar 2 números e mostrar o resultado. No entanto, é importante ter em conta que nos próximos exemplos várias dessas limitações serão abstraídas pela sua Linguagem WebAssembly favorita (neste caso, Rust). É altamente recomendável que você dê uma olhada no [wasm-pack QuickStart Guide](https://github.com/rustwasm/wasm-pack#-quickstart-guide), já que vamos nos referir a ele muitas vezes neste exemplo.

---

## Preparação do Projeto

Em primero lugar, vamos [instalar rust](https://www.rust-lang.org/tools/install), que inclui [cargo](https://doc.rust-lang.org/cargo/index.html). Então, usando cargo, vamos instalar wasm-pack, que vamos necessitar mais adiante:

```bash
cargo install wasm-pack
```

A seguir, vamos criar nosso "crate" de rust no diretório atual usando cargo:

```bash
cargo init
```

Então, vamos editar o nosso novo `Cargo.toml` para implementar [wasm-pack](https://github.com/rustwasm/wasm-pack#-quickstart-guide) como mencionado neste guia rápido de início:

```toml
[package]
name = "hello-world"
version = "0.1.0"
authors = ["Your Name <your@name.com>"]
edition = "2018"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"
```

Por último, vamos dar uma olhadinha dentro do diretório `src/`. Já que estamos construindo uma biblioteca (lib) para ser usada por uma aplicação maior, **precisamos renomear o `src/main.rs` para `src/lib.rs`.** Vá em frente e faça isso agora antes de continuar.

Agora que temos o nosso projeto e o ambiente configurados, vamos em frente e começar a implementação propriamente dita.

---

## Implementação

Vamos substituir `src/lib.rs` com a chamada necessária `use` como mencionado no guia rápido de início, bem como a nossa função de adição:

```rust
// The wasm-pack uses wasm-bindgen to build and generate JavaScript binding file.
// Import the wasm-bindgen crate.
use wasm_bindgen::prelude::*;

// Our Add function
// wasm-pack requires "exported" functions
// to include #[wasm_bindgen]
#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
  return a + b;
}
```

A partir de então, vamos compilar o nosso crate, usando wasm-pack, em um módulo wasm. Rode então o seguinte comando, observe que ele inclui [--target web](https://rustwasm.github.io/docs/wasm-pack/commands/build.html#target). A ferramenta wasm-pack pode gerar vários tipos de formatos de saída, especialmente para bundlers como o Webpack ou o Rollup. Mas como neste caso queremos um módulo ES6, utilizamos abaixo o alvo `web`:

```bash
wasm-pack build --target web
```

Com isso será gerado um diretório `pkg/` contendo o nosso módulo wasm, envolto em um objeto js. A seguir, vamos criar um arquivo `index.js`, e importar o módulo ES6 no nosso diretório `pkg/`. Então invocaremos a nossa função exportada `add()`:

```javascript
// Import our outputted wasm ES6 module
// Which, export default's, an initialization function
import init from "./pkg/hello_world.js";

const runWasm = async () => {
  // Instantiate our wasm module
  const helloWorld = await init("./pkg/hello_world_bg.wasm");

  // Call the Add function export from wasm, save the result
  const addResult = helloWorld.add(24, 24);

  // Set the result onto the body
  document.body.textContent = `Hello World! addResult: ${addResult}`;
};
runWasm();
```

Por último, vamos carregar o nosso Módulo ES6, o arquivo Javascript `index.js` no nosso `index.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Hello World - Rust</title>
    <script type="module" src="./index.js"></script>
  </head>
  <body></body>
</html>
```

E deveríamos ter um programa Wasm Add (Hello World) funcionando! Parabéns!

Você deveria poder ver algo similar a esta demo ([Source Code](/source-redirect?path=examples/hello-world/demo/rust)) abaixo:

## Demo

<iframe title="Rust Demo" src="/demo-redirect?example-name=hello-world"></iframe>

A seguir, vamos olhar mais o WebAssembly [Exports](/example-redirect?exampleName=exports) mais a fundo.
