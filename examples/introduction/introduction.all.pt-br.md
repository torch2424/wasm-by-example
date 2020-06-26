# Introdução

Vamos fazer uma breve introdução aos principais conceitos do WebAssembly:

- o WebAssembly é uma linguagem para rodar "bytecode" na web, e que também serve de alvo para compiladores.
- Em comparação com o Javascript, o WebAssembly oferece uma performance previsível. Não é inerentemente **mais rápido** que o Javascript, mas **pode ser mais rápido que o Javascript** se usado corretamente. Por ejemplo, em **tarefas de computação intensiva**, como loops dentro de outros loops ou o processamento de grandes quantidades de dados. Portanto, **o WebAssembly é um complemento ao JavaScript, e não um substituto**.
- o WebAssembly é extremamente portável. O WebAssembly roda em: todos os principais browsers web, os runtimes V8 como [Node.js](https://nodejs.org/en/), e runtimes independentes de Wasm como [Wasmtime](https://wasmtime.dev/), [Lucet](https://github.com/bytecodealliance/lucet), e [Wasmer](https://github.com/wasmerio/wasmer).
- o WebAssembly usa Memória Linear, ou seja, uma array grande e expansível. E, no contexto do Javascript, acessível em modo síncrono tanto pelo Javascript como por Wasm.
- o WebAssembly pode exportar funções e constantes, que, no contexto do Javascript, também são acessíveis em modo síncrono tanto pelo Javascript como por Wasm.
- o WebAssembly, na atual versão que é parte de um MVP (produto mínimo viável), processa somente inteiros e pontos flutuantes. No entanto, há ferramentas e bibliotecas que permitem, de forma conveniente, o fluxo de dados de mais alto nível.

Com isso em mente, vamos dar uma olhada no nosso [Olá, Mundo](/example-redirect?exampleName=hello-world) para observar alguns destes conceitos em ação.
