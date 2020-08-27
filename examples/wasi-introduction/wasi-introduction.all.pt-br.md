## Introdução à WASI

Em primeiro lugar, devemos responder à pergunta "O que é a WASI?". A resposta formal a isso é: WASI é a [Interface de Sistema do WebAssembly ou WebAssembly System Interface](https://wasi.dev/), "uma interface modular de sistema para o WebAssembly". Para disponibilizar uma fácil introdução à ideia de porque a WASI é empolgante, vamos dar uma olhada a alguns possíveis casos de uso quando os objetivos da WASI forem alcançados:

- **O que os programadores podem fazer com o WebAssembly/WASI?**
  - **Aplicações e jogos multiplataformas:** imagine que você tenha um único arquivo binário ou executável, capaz de rodar em qualquer plataforma com um runtime de WebAssembly. Ao permitir aplicações multiplataformas, tudo rodaria a partir de um único arquivo publicado.
  - **Reutilizar o código entre plataformas e casos de uso:** você pode imaginar a reutilização de código em toda a arquitetura da sua aplicação entre diferentes plataformas, tais como um cliente e um servidor, celulares e computadores e até mesmo dispositivos IOT (Internet of Things). Ou, se você estiver escrevendo uma biblioteca, criando um envoltório multiplataforma "WASI Shell" fino.
  - **Rodar aplicações escritas em qualquer linguagem compilável a Wasm/Wasi e uma única runtime:** isso significa que, em vez de ter várias runtimes específicos das linguagens usadas, você pode compilar todos os seus diversos projetos ao mesmo alvo e usar uma única runtime para rodar todos eles!
  - **Pôr as aplicações em "Containers" e também as dependências em um único alvo:** Conforme o ponto anterior, uma aplicação, com todas as suas dependências, pode ser compilada a um arquivo (ou arquivos) WebAssembly. Portanto, já não faz mais falta um container para transformar todas as dependências em uma única unidade, todas elas se tornam WebAssembly rodando em uma runtime. Isso traria benefícios tais como uma melhor usabilidade e menor ou nenhum consumo extra de recursos. Isto não substitui containers mas poderia ser uma melhor alternativa para algumas aplicações.
  - **E Muito Mais!**

É importante observar que **esses são exemplos de casos de uso de alto nível, nem todos eles podem ser feitos com a versão atual de WASI**, e vamos falar como a WASI ainda se encontra em progresso e sendo sendo padronizada. No entanto, agora que temos uma ideia geral das portas que a WASI pode abrir para os programadores, vamos começar a nos aprofundar nos detalhes de como funciona:

- **Como que a WASI oferece funcionalidades adicionais?**
  - **O resumo TL;DR da WASI é:** ela permite rodar o WebAssembly fora do navegador.
  - WASI oferece um [conjunto de APIs padronizadas](https://github.com/WebAssembly/WASI/blob/master/phases/snapshot/docs.md) para que os módulos de WebAssembly acessem os recursos de sistema tais como o Sistemas de Arquivos, Redes, Data e hora, Random, etc... .
- **Como que os módulos do WebAssembly usam a WASI?**
  - Um módulo de WebAssembly module vai usar os imports ([Parecido a quando fizemos isso no browser usando `importObject` com o JavaScript no exemplo "Como Importar Funções do Javascript Em WebAssembly"](/example-redirect?exampleName=importing-javascript-functions-into-webassembly)), e assim ser capaz de acessar as conexões da API padrão da WASI (no sentido de que os nomes dessas funções importObject se mapeiam diretamente à implementação acordada).

Eu também acho que valeria a pena já aprender alguns termos chaves. Eles vão facilitar muito conversar sobre o WebAssembly fora do navegador com a WASI, e pintar uma imagem mais completa do que foi explicado acima:

- **"Hosts"**
  - Hosts são as Runtimes do WebAssembly Runtimes que rodam os seus módulos. Nos nossos exemplos anteriores, focados no navegador, o host seria a implementação do WebAssembly no seu navegador web (por exemplo, o V8 do Google Chrome).
  - Quando o WebAssembly roda no servidor, ao contrário do navegador, você normalmente não precisa de um motor completo com suporte para HTML, CSS, JavaScript, etc... Então há algumas poucas runtimes ou interpretadores independentes do WebAssembly que você pode usar como host, por exemplo:
    - [Wasmtime](https://wasmtime.dev/)
    - [Lucet](https://github.com/bytecodealliance/lucet)
    - [Wasmer](https://wasmer.io/)
    - [Wasm3](https://github.com/wasm3/wasm3)
  - A maioria das runtimes/interpretadores do WebAssembly podem ser usados como uma interface de linha de comando, ou embutidos/conectados em uma aplicação maior usando as suas APIs de biblioteca.
  - Cada um desses projetos têm as suas próprias vantagens, e escolher o melhor host para você realmente depende do seu caso de uso. E há muitos mais projetos lá fora que você pode escolher!
- **"Guests"**
  - Os guests são os módulos do WebAssembly que o host roda. Se você planeja escrever módulos de WebAssembly, então você deveria escrever a aplicação guest que roda dentro da aplicação host.
  - O host é capaz de prover funcionalidades extras ao guest, ao executar tarefas no lugar do guest. Essa prestação se oferece passando funções ao importObject ([Similar a quando fizemos isso no browser usando `importObject` com o JavaScript no exemplo "Como Importar Funções do Javascript Em WebAssembly"](/example-redirect?exampleName=importing-javascript-functions-into-webassembly)).
  - E isto nos remete de volta à WASI, já que a WASI é o conjunto padrão de APIs para que os hosts façam as ações de sistema (tais como as ações de operações do sistema de arquivos) para o módulo guest de WebAssembly. Portanto, isso permite que os programadores escrevam módulos WebAssembly que podem acessar os recursos de sistema!

A última coisa que vale a pena mencionar é que a WASI usa um [modelo de segurança baseado em capacidade](https://github.com/bytecodealliance/wasmtime/blob/master/docs/WASI-capabilities.md). Significa que o host deve oferecer explicitamente uma capacidade ao módulo guest para que ele possa realizar uma ação. Por exemplo, no [Wasmtime](https://wasmtime.dev/), por padrão, o módulo guest não pode acessar qualquer parte do sistema de arquivos do host. O usuário que invoca o Wasmtime deve passar os parâmetros `--mapdir` ou `--dir` para autorizar aos módulos a capacidade de acessar diretórios no sistema de arquivos do host.

No momento em que escrevemos esta introdução, grande parte da WASI ainda são propostas em discussão. Outros recursos de sistema, tais como rede, ainda não são parte do padrão WASI, mas um dia serão. Então, se você estiver esperando fazer o `bind()` de um socket no seu módulo WebAssembly, os hosts WASI ainda não expõem essa capacidade. Apenas algumas poucas funcionalidades das que a WASI espera atingir estão completamente implementadas e padronizadas. Uma dessas funcionalidades é o acesso ao sistema de arquivos!

Portanto, vamos dar uma olhada em como modificar o sistema de arquivos no [exemplo de "Olá, Mundo" com WASI](/example-redirect?exampleName=wasi-hello-world), se já houver um "olá, mundo" para a sua linguagem. Se não, sinta-se à vontade para olhar a documentação da sua linguagem para ver se já suporta a WASI e nos mandar o [exemplo de "Olá, Mundo" com WASI para a sua linguagem](https://github.com/torch2424/wasm-by-example).
