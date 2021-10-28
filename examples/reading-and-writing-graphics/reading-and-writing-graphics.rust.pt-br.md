# Como Ler e Escrever Gráficos

## Visão Geral

Como já havíamos mencionado antes, **o WebAssembly é ótimo para tarefas de computação intensivas**. Por exemplo, as tarefas que envolvam coisas como Big Data, lógica pesada com condicionais ou loops dentro de loops. Portanto, gerar e renderizar gráficos **pode** obter uma aceleração significativa ao se migrar essas partes ao WebAssembly. Neste exemplo, iremos gerar imagens de tabuleiro de xadrez de 20x20 ao ritmo de uma por segundo, e mostrá-las em um [Canvas HTML5](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) usando [a Manipulação de Pixel no Objeto ImageData](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas). Na terminologia chique de gráficos, isso se chama rasterizador.

**NOTA:** Este exemplo vai continuar a desenvolver sobre o nosso exemplo simples de passagem de memória por um buffer/ponteiro. Isso se pode implementar com estruturas mais sofisticadas, as quais iremos cobrir em exemplos futuros.

Vejamos então o exemplo:

---

## Implementação

Como de costume, começamos como o nosso arquivo `src/lib.rs`. Você vai perceber aqui que configuramos um buffer, de forma similar ao que fizemos no exemplo de [Memória Linear do WebAssembly](/example-redirect?exampleName=webassembly-linear-memory). Fazendo desta maneira o Javascript pode ler os valores colocados no buffer mais tarde. Por favor, não deixe de ler os comentários nos seguintes exemplos de código, e não deixe de seguir os links ou de olhar os exemplos anteriores se alguma coisa não estiver clara. Vamos em frente então:

```rust
// The wasm-pack uses wasm-bindgen to build and generate JavaScript binding file.
// Import the wasm-bindgen crate.
use wasm_bindgen::prelude::*;

// Define the size of our "checkerboard"
const CHECKERBOARD_SIZE: usize = 20;

/*
 * 1. What is going on here?
 * Create a static mutable byte buffer.
 * We will use for putting the output of our graphics,
 * to pass the output to js.
 * NOTE: global `static mut` means we will have "unsafe" code
 * but for passing memory between js and wasm should be fine.
 *
 * 2. Why is the size CHECKERBOARD_SIZE * CHECKERBOARD_SIZE * 4?
 * We want to have 20 pixels by 20 pixels. And 4 colors per pixel (r,g,b,a)
 * Which, the Canvas API Supports.
 */
const OUTPUT_BUFFER_SIZE: usize = CHECKERBOARD_SIZE * CHECKERBOARD_SIZE * 4;
static mut OUTPUT_BUFFER: [u8; OUTPUT_BUFFER_SIZE] = [0; OUTPUT_BUFFER_SIZE];

// Function to return a pointer to our buffer
// in wasm memory
#[wasm_bindgen]
pub fn get_output_buffer_pointer() -> *const u8 {
  let pointer: *const u8;
  unsafe {
    pointer = OUTPUT_BUFFER.as_ptr();
  }

  return pointer;
}

// Function to generate our checkerboard, pixel by pixel
#[wasm_bindgen]
pub fn generate_checker_board(
    dark_value_red: u8,
    dark_value_green: u8,
    dark_value_blue: u8,
    light_value_red: u8,
    light_value_green: u8,
    light_value_blue: u8
    ) {


  // Since Linear memory is a 1 dimensional array, but we want a grid
  // we will be doing 2d to 1d mapping
  // https://softwareengineering.stackexchange.com/questions/212808/treating-a-1d-data-structure-as-2d-grid
  for y in 0..CHECKERBOARD_SIZE {
    for x in 0..CHECKERBOARD_SIZE {
      // Set our default case to be dark squares
      let mut is_dark_square: bool = true;

      // We should change our default case if
      // We are on an odd y
      if y % 2 == 0 {
        is_dark_square = false;
      }

      // Lastly, alternate on our x value
      if x % 2 == 0 {
        is_dark_square = !is_dark_square;
      }

      // Now that we determined if we are dark or light,
      // Let's set our square value
      let mut square_value_red: u8 = dark_value_red;
      let mut square_value_green: u8 = dark_value_green;
      let mut square_value_blue: u8 = dark_value_blue;
      if !is_dark_square {
        square_value_red = light_value_red;
        square_value_green = light_value_green;
        square_value_blue = light_value_blue;
      }

      // Let's calculate our index, using our 2d -> 1d mapping.
      // And then multiple by 4, for each pixel property (r,g,b,a).
      let square_number: usize = y * CHECKERBOARD_SIZE + x;
      let square_rgba_index: usize = square_number * 4;

      // Finally store the values.
      unsafe {
        OUTPUT_BUFFER[square_rgba_index + 0] = square_value_red; // Red
        OUTPUT_BUFFER[square_rgba_index + 1] = square_value_green; // Green
        OUTPUT_BUFFER[square_rgba_index + 2] = square_value_blue; // Blue
        OUTPUT_BUFFER[square_rgba_index + 3] = 255; // Alpha (Always Opaque)
      }
    }
  }
}
```

A seguir, podemos compilar o módulo seguindo os mesmos passos de compilação dos exemplos do [Olá, Mundo](/example-redirect?exampleName=hello-world), substituindo os nomes dos arquivos conforme apropriado.

Depois, criamos um arquivo `index.js` para carregar e rodar o nosso wasm gerado. Importamos o módulo de inicialização do `pkg/graphics.js` que foi gerado pelo wasm-pack. Então, invocamos o módulo passando a localização do nosso arquivo wasm `pkg/graphics_bg.wasm` que também foi gerado pelo wasm-pack. Boa parte da lógica aqui amplia o exemplo da [Memória Linear do WebAssembly](/example-redirect?exampleName=webassembly-linear-memory), mas aplicando o que aprendemos à API do DOM. A coisa mais importante a observar aqui é provavelmente como estamos copiando a memória do Wasm, usando chamadas `.slice`. Por favor, veja os links de referência se as coisas parecerem confusas. O `index.js` está abaixo!

```javascript
import wasmInit from "./pkg/graphics.js";

const runWasm = async () => {
  // Instantiate our wasm module
  const rustWasm = await wasmInit("./pkg/graphics_bg.wasm");

  // Create a Uint8Array to give us access to Wasm Memory
  const wasmByteMemoryArray = new Uint8Array(rustWasm.memory.buffer);

  // Get our canvas element from our index.html
  const canvasElement = document.querySelector("canvas");

  // Set up Context and ImageData on the canvas
  const canvasContext = canvasElement.getContext("2d");
  const canvasImageData = canvasContext.createImageData(
    canvasElement.width,
    canvasElement.height
  );

  // Clear the canvas
  canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);

  const getDarkValue = () => {
    return Math.floor(Math.random() * 100);
  };

  const getLightValue = () => {
    return Math.floor(Math.random() * 127) + 127;
  };

  const drawCheckerBoard = () => {
    const checkerBoardSize = 20;

    // Generate a new checkboard in wasm
    rustWasm.generate_checker_board(
      getDarkValue(),
      getDarkValue(),
      getDarkValue(),
      getLightValue(),
      getLightValue(),
      getLightValue()
    );

    // Pull out the RGBA values from Wasm memory
    // Starting at the memory index of out output buffer (given by our pointer)
    // 20 * 20 * 4 = checkboard max X * checkerboard max Y * number of pixel properties (R,G.B,A)
    const outputPointer = rustWasm.get_output_buffer_pointer();
    const imageDataArray = wasmByteMemoryArray.slice(
      outputPointer,
      outputPointer + checkerBoardSize * checkerBoardSize * 4
    );

    // Set the values to the canvas image data
    canvasImageData.data.set(imageDataArray);

    // Clear the canvas
    canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);

    // Place the new generated checkerboard onto the canvas
    canvasContext.putImageData(canvasImageData, 0, 0);
  };

  drawCheckerBoard();
  setInterval(() => {
    drawCheckerBoard();
  }, 1000);
};
runWasm();
```

Por último, carregamos o nosso Módulo ES6, o arquivo Javascript `index.js`, no nosso `index.html`. E não deixemos de adicionar um elemento canvas também! **Dica aleatória:** use a propriedade CSS [image-rendering](https://css-tricks.com/almanac/properties/i/image-rendering/) para mostrar a pixel art e outras imagens nítidas corretamente.

```html
<!-- Other HTML here. -->

<body>
  <canvas
    width="20"
    height="20"
    style="image-rendering: pixelated; image-rendering: crisp-edges; width: 100%;"
  >
  </canvas>
</body>

<!-- Other HTML here. -->
```

Aqui você deveria obter algo parecido à demo ([Código Fonte](/source-redirect?path=examples/reading-and-writing-graphics/demo/rust)) abaixo!

---

## Demo

<iframe width="300px" height="300px" title="Rust Demo" src="/demo-redirect?example-name=reading-and-writing-graphics"></iframe>

No próximo exemplo, daremos uma olhada na implementação de [Como Ler e Escrever Áudio com o WebAssembly](/example-redirect?exampleName=reading-and-writing-audio).
