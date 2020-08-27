# Olá, Mundo com WASI

## Visão Geral

Neste exemplo, vamos escrever "Olá, Mundo!" tanto na console (`stdout`) como em um novo arquivo `./hello-world.txt`. É altamente recomendável que você leia antes a [Introdução à WASI](/example-redirect?exampleName=wasi-introduction) antes de continuar com este exemplo. Você deve instalar o[wasmtime](https://wasmtime.dev/) já que essa é a runtime de WebAssembly que iremos usar como o nosso host. Você também deve comprovar que o Rust está instalado usando a ferramenta [rustup](https://rustup.rs/).

Este exemplo é parecido ao [Tutorial de WASI no repositório do wasmtime](https://github.com/bytecodealliance/wasmtime/blob/master/docs/WASI-tutorial.md).

---

## Implementação

Primeiro, geramos um novo executável com cargo:

```bash
$ cargo new --bin wasi_hello_world
$ cd wasi_hello_world
```

Depois, abrimos `src/main.rs` e colamos o seguinte conteúdo. Favor olhar os comentários para entender o que o nosso programa vai fazer:

```rust
// Import rust's io and filesystem module
use std::io::prelude::*;
use std::fs;

// Entry point to our WASI applications
fn main() {

  // Print out hello world!
  // This will handle writing to stdout for us using the WASI APIs (e.g fd_write)
  println!("Hello world!");

  // Create a file
  // We are creating a `helloworld.txt` file in the `/helloworld` directory
  // This code requires the Wasi host to provide a `/helloworld` directory on the guest.
  // If the `/helloworld` directory is not available, the unwrap() will cause this program to panic.
  // For example, in Wasmtime, if you want to map the current directory to `/helloworld`,
  // invoke the runtime with the flag/argument: `--mapdir /helloworld::.`
  // This will map the `/helloworld` directory on the guest, to  the current directory (`.`) on the host
  let mut file = fs::File::create("/helloworld/helloworld.txt").unwrap();

  // Write the text to the file we created
  write!(file, "Hello world!\n").unwrap();
}
```

Como mencionado nos comentários do programa, mesmo que as [WASI APIs](https://github.com/WebAssembly/WASI/blob/master/phases/snapshot/docs.md) não estejam sendo usadas diretamente, quando o compilamos para a WASI as APIs do rust usarão essas APIs da WASI para nós automaticamente.

A seguir, adicionamos a WASI como um alvo de compilação pedindo à ferramenta rustup que instale esse suporte e, assim, poderemos compilar o programa à WASI. Para isso, rodamos:

```bash
$ rustup target add wasm32-wasi
$ cargo build --target wasm32-wasi
```

O nosso arquivo wasm deveria ser compilado a `target/wasm32-wasi/debug/wasi_hello_world.wasm`. E agora podemos rodar o nosso programa!

Para isso, podemos usar a linha de comando do Wasmtime, que lhe pedimos para instalar no início deste tutorial. No entanto, há uma coisa a notar que foi mencionada nos comentários do programa. **Precisamos explicitamente dar ao nosso programa acesso à criação de arquivos no nosso host, pois o nosso programa cria um novo arquivo**. Como mencionado na [Introdução à WASI](/example-redirect?exampleName=wasi-introduction), o nosso guest não tem essa capacidade a menos que nós lhe demos tal capacidade.

Para autorizar o uso da capacidade de escrever em um diretório usando a linha de comando do Wasmtime, precisamos passar o parâmetro `--mapdir`. `--mapdir` nos permite mapear o diretório `/helloworld` no sistema de arquivos virtual do guest, ao diretório atual (`.`) no sistema de arquivos do host. Por exemplo:

```bash
wasmtime --mapdir GUEST_DIRECTORY::HOST_DIRECTORY my-wasi-program.wasm
```

E assim, **para rodar o nosso programa WASI compilado, executamos**:

```bash
wasmtime --mapdir /helloworld::. target/wasm32-wasi/debug/wasi_hello_world.wasm
```

Você deve então ver "Hello World!" escrito na tela do seu terminal. E também deve notar que um novo arquivo `helloworld.txt` apareceu no seu diretório atual, com o conteúdo "Hello World!".

Viva! Escrevemos com sucesso o nosso primeiro módulo WASI.

---

A WASI ainda está crescendo, e tem um monte de projetos que se beneficiam dela para fazer coisas interessantes! Você pode ver alguns exemplos de projetos escritos para, ou portados para o WebAssembly usando WASI, procurando "WASI" em [Feito com o WebAssembly](https://madewithwebassembly.com/). Se você queria aprender mais a respeito de Rust e WASI em um nível de chamadas de sistemas, veja este [ótimo tutorial por Jakub Konka](http://www.jakubkonka.com/2020/04/28/rust-wasi-from-scratch.html).

Sinta-se à vontade para [corrigir, sugerir, ou contribuir com mais exemplos](https://github.com/torch2424/wasm-by-example)!
