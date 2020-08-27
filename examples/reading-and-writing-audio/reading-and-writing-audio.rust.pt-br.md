# Como Ler e Escrever Áudio

## Visão Geral

**ATENÇÃO: Esta "ideia" de demo não deveria ser usada em produção. Nem as conversões manuais de tipos. Isto é só para o nosso aprendizado e o texto menciona quando alguma coisa não deve ser usada.**

Como já havíamos mencionado antes, **o WebAssembly é ótimo para tarefas de computação intensivas**. Por exemplo, as tarefas que envolvam coisas como Big Data, lógica pesada com condicionais ou loops dentro de loops. Portanto, gerar e renderizar amostras de áudio **pode** obter uma aceleração significativa ao se migrar essas partes ao WebAssembly. Neste exemplo, iremos amplificar amostras de áudio de um [AudioBuffer](https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer) usando a [API de Web Audio](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API). **Nota:** Esta funcionalidade pode e deve ser feita por meio de um [Nó de Ganho](https://developer.mozilla.org/en-US/docs/Web/API/GainNode), mas faremos desta outra forma apenas para efeitos de demonstração. **Um uso de caso ainda mais realista (embora mais complicado e pouco adequado para uma demo)**, seria implementar efeitos de uma API de Áudio sem suporte como a [bitcrusher](https://github.com/jaz303/bitcrusher) ([Vídeo de Exemplo](https://youtu.be/bVcpCswqCXA?t=10)), ou um [decodificador ogg decoder para browsers não suportados](https://en.wikipedia.org/wiki/HTML5_audio#Supported_audio_coding_formats).

**Mais uma nota:** Este exemplo vai continuar a desenvolver sobre o nosso exemplo simples de passagem de memória por um buffer/ponteiro. Isso se pode implementar com estruturas mais sofisticadas, as quais iremos cobrir em exemplos futuros.

Vejamos então o exemplo:

---

## Implementação

Antes de começar a implementação, se você não está familiarizado com o áudio digital ou como ele funciona, sugiro veementemente assistir este [vídeo sobre "Como Funciona o Áudio Digital" por Computerphile](https://www.youtube.com/watch?v=1RIA9U5oXro). Mas um rápido TL;DR, o Áudio Digital pode ser representado por uma matriz unidimensional, contendo sinais positivos (1.0) e negativos (-1.0). Nela o índice da matriz representa o tempo, e o valor representa o sinal (positivo ou negativo), e o volume (de 0 a 1.0).

Como de costume, começamos como o nosso arquivo `src/lib.rs`. Você vai perceber aqui que configuramos um buffer, de forma similar ao que fizemos no exemplo de [Memória Linear do WebAssembly](/example-redirect?exampleName=webassembly-linear-memory). De forma a passar esses valores ao Javascript, escrevemos na memória do Wasm. Fazendo desta maneira o Javascript pode ler os valores colocados no buffer mais tarde. Por favor, não deixe de ler os comentários nos seguintes exemplos de código, e não deixe de seguir os links ou de olhar os exemplos anteriores se alguma coisa não estiver clara. Vamos em frente então:

```rust
// The wasm-pack uses wasm-bindgen to build and generate JavaScript binding file.
// Import the wasm-bindgen crate.
use wasm_bindgen::prelude::*;

// Define our number of samples we handle at once
const NUMBER_OF_SAMPLES: usize = 1024;

// Create a static mutable byte buffers.
// We will use these for passing audio samples from
// javascript to wasm, and from wasm to javascript
// NOTE: global `static mut` means we will have "unsafe" code
// but for passing memory between js and wasm should be fine.
static mut INPUT_BUFFER: [u8; NUMBER_OF_SAMPLES] = [0; NUMBER_OF_SAMPLES];
static mut OUTPUT_BUFFER: [u8; NUMBER_OF_SAMPLES] = [0; NUMBER_OF_SAMPLES];

// Function to return a pointer to our
// output buffer in wasm memory
#[wasm_bindgen]
pub fn get_input_buffer_pointer() -> *const u8 {
  let pointer: *const u8;
  unsafe {
    pointer = INPUT_BUFFER.as_ptr();
  }

  return pointer;
}

// Function to return a pointer to our
// output buffer in wasm memory
#[wasm_bindgen]
pub fn get_output_buffer_pointer() -> *const u8 {
  let pointer: *const u8;
  unsafe {
    pointer = OUTPUT_BUFFER.as_ptr();
  }

  return pointer;
}

// Function to do the amplification.
// By taking the samples currently in the input buffer
// amplifying them, and placing the result in the output buffer
#[wasm_bindgen]
pub fn amplify_audio() {

  // Loop over the samples
  for i in 0..NUMBER_OF_SAMPLES {
    // Load the sample at the index
    let mut audio_sample: u8;
    unsafe {
      audio_sample = INPUT_BUFFER[i];
    }

    // Amplify the sample. All samples
    // Should be implemented as bytes.
    // Byte samples are represented as follows:
    // 127 is silence, 0 is negative max, 256 is positive max
    if audio_sample > 127 {
      let audio_sample_diff = audio_sample - 127;
      audio_sample = audio_sample + audio_sample_diff;
    } else if audio_sample < 127 {
      audio_sample = audio_sample / 2;
    }

    // Store the audio sample into our output buffer
    unsafe {
      OUTPUT_BUFFER[i] = audio_sample;
    }
  }
}
```

A seguir, podemos compilar o módulo seguindo os mesmos passos de compilação dos exemplos do [Olá, Mundo](/example-redirect?exampleName=hello-world), substituindo os nomes dos arquivos conforme apropriado.

Depois, criamos um arquivo `index.js`. No começo deste arquivo, iremos configurar o nosso [AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext), bem como um monte de buffers e outras coisas que usaremos mais tarde:

```javascript
// Some general initialization for audio

// Create our audio context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Create the number of samples we want for our audio buffer,
// As well as create an empty stereo buffer at the sample rate of the AudioContext
const numberOfSamples = 1024;
const audioBuffer = audioContext.createBuffer(
  2,
  numberOfSamples,
  audioContext.sampleRate
);

// Create our originalAudioSamples, and our amplifiedAudioSamples Buffers
const originalAudioSamples = new Float32Array(numberOfSamples);
const amplifiedAudioSamples = new Float32Array(numberOfSamples);
```

Agora, vamos configurar algumas conversões de tipo no nosso `index.js`, porque a API de Áudio Web recebe números de ponto flutuantes (entre -1.0 e 1.0) como amostras de áudio, mas **apenas para efeitos de demonstração** eu gostaria de mostrar como fazer isso usando apenas bytes na memória linear do Wasm. Como este é um tipo de trabalho desnecessário, isso **não deveria ser feito em produção**. Em vez disso você provavelmente vai querer usar estruturas de dados de mais alto nível, que mostraremos em exemplos futuros. Mas, assim é como faríamos a conversão se quiséssemos prosseguir com uma matriz de bytes:

```javascript
// Function to convert float samples to byte samples
// This is mostly for demostration purposes.
// Float samples follow the Web Audio API spec:
// https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer
// Byte samples are represented as follows:
// 127 is silence, 0 is negative max, 256 is positive max
const floatSamplesToByteSamples = floatSamples => {
  const byteSamples = new Uint8Array(floatSamples.length);
  for (let i = 0; i < floatSamples.length; i++) {
    const diff = floatSamples[i] * 127;
    byteSamples[i] = 127 + diff;
  }
  return byteSamples;
};

// Function to convert byte samples to float samples
// This is mostly for demostration purposes.
// Float samples follow the Web Audio API spec:
// https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer
// Byte samples are represented as follows:
// 127 is silence, 0 is negative max, 256 is positive max
const byteSamplesToFloatSamples = byteSamples => {
  const floatSamples = new Float32Array(byteSamples.length);
  for (let i = 0; i < byteSamples.length; i++) {
    const byteSample = byteSamples[i];
    const floatSample = (byteSample - 127) / 127;
    floatSamples[i] = floatSample;
  }
  return floatSamples;
};
```

A seguir, vamos carregar / instanciar o módulo de wasm,`audio_bg.wasm`, no nosso `index.js`, e realizar a nossa geração e amplificação reais de áudio. Uma vez mais seguiremos o instanciamento de módulo do exemplo [Olá, Mundo](/example-redirect?exampleName=hello-world). Muito da lógica aqui expande o [Exemplo de Memória Linear do WebAssembly](/example-redirect?exampleName=webassembly-linear-memory), mas aplicando o aprendizado à API do DOM. A coisa mais importante aqui é, provavelmente, como estamos copiando a memória do Wasm, usando chamadas `.slice`. Se parecer confuso, por favor olhe os links de referência. Deixe-me destacar novamente que esse tipo de conversão é meio que desnecessário e **não deveria ser usado em produção**. Está aqui apenas para mostrar como você pode convertê-los em bytes.

Assim é como fica a criação da instância de wasm / amplificação de áudio no nosso `index.js` abaixo!

```javascript
const runWasm = async () => {
  const runWasm = async () => {
    // Instantiate our wasm module
    const rustWasm = await wasmInit("./pkg/audio_bg.wasm");

    // Create a Uint8Array to give us access to Wasm Memory
    const wasmByteMemoryArray = new Uint8Array(rustWasm.memory.buffer);

    // Generate 1024 float audio samples,
    // and make a quiet / simple square wave
    const sampleValue = 0.3;
    for (let i = 0; i < numberOfSamples; i++) {
      if (i < numberOfSamples / 2) {
        originalAudioSamples[i] = sampleValue;
      } else {
        originalAudioSamples[i] = sampleValue * -1;
      }
    }

    // Convert our float audio samples
    // to a byte format for demonstration purposes
    const originalByteAudioSamples = floatSamplesToByteSamples(
        originalAudioSamples
        );

    // Fill our wasm memory with the converted Audio Samples,
    // And store it at our inputPointer location (index)
    const inputPointer = rustWasm.get_input_buffer_pointer();
    wasmByteMemoryArray.set(originalByteAudioSamples, inputPointer);

    // Amplify our loaded samples with our export Wasm function
    rustWasm.amplify_audio();

    // Get our outputPointer (index were the sample buffer was stored)
    // Slice out the amplified byte audio samples
    const outputPointer = rustWasm.get_output_buffer_pointer();
    const outputBuffer = wasmByteMemoryArray.slice(
        outputPointer,
        outputPointer + numberOfSamples
        );

    // Convert our amplified byte samples into float samples,
    // and set the outputBuffer to our amplifiedAudioSamples
    amplifiedAudioSamples.set(byteSamplesToFloatSamples(outputBuffer));

    // We are now done! The "play" Functions will handle playing the
    // audio buffer
};
runWasm();
```

Depois, precisamos disponibilizar uma forma de fazer play e pausa nos buffers de áudio buffers usando [AudioBufferSourceNode](https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode). Então, no final do nosso `index.js` adicionamos:

```javascript
function beforePlay() {
  // Check if context is in suspended state (autoplay policy)
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}

// Set up playing the Audio Buffer
// Using a shared Audio buffer Source
let audioBufferSource = undefined;
function stopAudioBufferSource() {
  // If we have an audioBufferSource
  // Stop and clear our current audioBufferSource
  if (audioBufferSource) {
    audioBufferSource.stop();
    audioBufferSource = undefined;
  }
}
function createAndStartAudioBufferSource() {
  // Stop the the current audioBufferSource
  stopAudioBufferSource();

  // Create an AudioBufferSourceNode.
  // This is the AudioNode to use when we want to play an AudioBuffer,
  // Set the buffer to our buffer source,
  // And loop the source so it continuously plays
  audioBufferSource = audioContext.createBufferSource();
  audioBufferSource.buffer = audioBuffer;
  audioBufferSource.loop = true;

  // Connect our source to our output, and start! (it will play silence for now)
  audioBufferSource.connect(audioContext.destination);
  audioBufferSource.start();
}

window.playOriginal = () => {
  beforePlay();
  // Set the float audio samples to the left and right channel
  // of our playing audio buffer
  audioBuffer.getChannelData(0).set(originalAudioSamples);
  audioBuffer.getChannelData(1).set(originalAudioSamples);

  createAndStartAudioBufferSource();
};

window.playAmplified = () => {
  beforePlay();
  // Set the float audio samples to the left and right channel
  // of our playing audio buffer
  audioBuffer.getChannelData(0).set(amplifiedAudioSamples);
  audioBuffer.getChannelData(1).set(amplifiedAudioSamples);

  createAndStartAudioBufferSource();
};

window.pause = () => {
  beforePlay();
  stopAudioBufferSource();
};
```

Por último, vamos nos assegurar que temos o seguinte no nosso `index.html` para prover botões para chamar as nossas funções de play e pausa e assim reproduzir o nosso áudio:

```html
<!-- Other HTML here. -->

<body>
  <h1>NOTE: Be careful if using headphones</h1>

  <h1>Original Sine Wave</h1>
  <div><button onclick="playOriginal()">Play</button></div>

  <hr />

  <h1>Amplified Sine Wave</h1>
  <div><button onclick="playAmplified()">Play</button></div>

  <hr />

  <h1>Pause</h1>
  <div><button onclick="pause()">Pause</button></div>
</body>

<!-- Other HTML here. -->
```

Com tudo isso você deveria obter algo parecido à demo ([Código Fonte](/source-redirect?path=examples/reading-and-writing-audio/demo/rust)) abaixo! **Nota:** Usamos um montão de Javascript para deixar o Áudio todo configurado, e eu recomendo muito clicar no link do código fonte que disponibilizamos para obter uma visão completa de tudo que está acontecendo.

---

## Demo

<iframe width="100%" height="500px" title="Rust Audio Demo" src="/demo-redirect?example-name=reading-and-writing-audio"></iframe>

No próximo exemplo, daremos uma olhada nas estruturas de alto nível, especificamente como movimentar [strings](/example-redirect?exampleName=strings).
