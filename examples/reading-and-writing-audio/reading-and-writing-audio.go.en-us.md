# Reading and Writing Audio

## Overview

**NOTE: This demo "idea" should not be used in production. As well as the manual type conversions. This is just for learning purposes. The text will contain mentions of when something should not be used.**

As stated before, **WebAssembly is a great fit for computationally intensive tasks**. For example, Tasks that involve things like big data, heavy logic with conditionals, or nested looping. Thus, generating / rendering audio samples **can** get a significant speedup by moving these mentioned parts into WebAssembly. In this example, we will be amplifying audio samples from an [AudioBuffer](https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer) using the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API). **Note:** This functionality can and should be done through a [Gain Node](https://developer.mozilla.org/en-US/docs/Web/API/GainNode), but this is mostly for demonstration purposes. **A more realistic (albeit more complicated and not fit for a demo) use case**, would be to implement unsupported Web Audio API effects like a [bitcrusher](https://github.com/jaz303/bitcrusher) ([Example Video](https://youtu.be/bVcpCswqCXA?t=10)), or a [ogg decoder for unsupported browsers](https://en.wikipedia.org/wiki/HTML5_audio#Supported_audio_coding_formats).

**Another Note:** This example will continue to build on our simple buffer/pointer memory passing. This could be implemented using higher-level data structures, and these data structures will be covered in later examples.

So let's get into the example:

---

## Implementation

Before starting implementation, if you are not familiar with digital audio, or how it works, I'd highly suggest watching this [video on "How Digital Audio Works" by Computerphile](https://www.youtube.com/watch?v=1RIA9U5oXro). But a quick TL;DR, Digital Audio can be represented by a one dimensional array, containing positive (1.0) and negative (-1.0) signals. Where the index of the array represents time, and the value represents the signal (positive or negative), and the volume (e.g 0 -> 1.0).

As usual, let's get started with our `main.go` file. You will notice here we set up a buffer, similar to the [WebAssembly Linear Memory example](/example-redirect?exampleName=webassembly-linear-memory). In order to pass back our pixel values into Javascript, we will write these values into Wasm Memory. That way, Javascript can read them later. Please be sure to read the comments in the following code examples, and be sure to follow links or look at previous examples if something does not make sense. Let's get into it:

```go
package main

// Create some buffer/pointers (array index and size) to where
// in memory we are storing the pixels.
// Javascript writes to the INPUT_BUFFER,
// and Wasm will write the result in the OUTPUT_BUFFER
const INPUT_BUFFER_SIZE int = 1024;
var inputBuffer [INPUT_BUFFER_SIZE]uint8;
const OUTPUT_BUFFER_SIZE int = INPUT_BUFFER_SIZE;
var outputBuffer [OUTPUT_BUFFER_SIZE]uint8;

// Declare a main function, this is the entrypoint into our go module
// That will be run. In our example, we won't need this
func main() {}

// Functions to return a pointer (Index) to our buffer in wasm memory

//export getInputBufferPointer
func getInputBufferPointer() *[INPUT_BUFFER_SIZE]uint8 {
  return &inputBuffer
}

//export getOutputBufferPointer
func getOutputBufferPointer() *[OUTPUT_BUFFER_SIZE]uint8 {
  return &outputBuffer
}


// Function to return the size of our buffer in wasm memory

//export getInputBufferSize
func getInputBufferSize() int {
  return INPUT_BUFFER_SIZE;
}

//export getOutputBufferSize
func getOutputBufferSize() int {
  return OUTPUT_BUFFER_SIZE;
}

// Function to do the amplification
//export amplifyAudioInBuffer
func amplifyAudioInBuffer() {
  // Loop over the samples
  for i := 0; i < INPUT_BUFFER_SIZE; i++ {
    // Load the sample at the index
    audioSample := inputBuffer[i];

    // Amplify the sample. All samples
    // Should be implemented as bytes.
    // Byte samples are represented as follows:
    // 127 is silence, 0 is negative max, 256 is positive max
    if audioSample > 127 {
      audioSampleDiff := audioSample - 127;
      audioSample = audioSample + audioSampleDiff;
    } else if audioSample < 127 {
      audioSample = audioSample / 2;
    }

    // Store the audio sample into our output buffer
    outputBuffer[i] = audioSample;
  }
}
```

Then, let's compile `main.go` into a wasm module, using the TinyGo compiler. This will output a `main.wasm`:

```bash
tinygo build -o main.wasm -target wasm ./main.go
```

---

Then, let's create an `index.html`, and get our appropriate `wasm_exec.js` following the steps laid out in the [Hello World Example](/example-redirect?exampleName=hello-world). Also, we will add some buttons and a notice for how loud the audio output will be:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Reading and Writing Graphics - Go</title>
  </head>
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
    <script src="./wasm_exec.js"></script>
    <script type="module" src="./index.js"></script>
  </body>
</html>
```

Next, let's create an `index.js` file. In the beginning of this file, we should include our module for instantiating wasm modules like in our [Hello World Example](/example-redirect?exampleName=hello-world), as well as the Go wasm instantation line:

```javascript
// Imports are from the demo-util folder in the repo
// https://github.com/torch2424/wasm-by-example/blob/master/demo-util/
import { wasmBrowserInstantiate } from "/demo-util/instantiateWasm.js";

const go = new Go(); // Defined in wasm_exec.js. Don't forget to add this in your index.html.
```

Then, we will need to set up our [AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext), as well as a bunch of buffers and things that we will use later:

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

Next, let's set up some type conversion in our `index.js`. This is because the Web Audio API takes in floats (between -1.0 and 1.0) as their audio samples, but **for demonstration purposes** wanted to show how we can do this using only bytes in Wasm linear memory. Since this is kind of unneccesary work, this **should not be used in production**. Instead you'd probably want to use higher level data structures, which we will show in later examples. But, here is how we'd do the conversion if we wanted to stick with a byte array:

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

Next, Let's load / instantiate the wasm module, `main.wasm` in our `index.js`, and perform our actual audio generation and amplification. Again, we will follow the module instantiation from the [Hello World](/example-redirect?exampleName=hello-world) example. A lot of the logic here is expanding on the [WebAssembly Linear Memory Example](/example-redirect?exampleName=webassembly-linear-memory), but applying the learnings to a DOM API. The most important thing here is probably how we are copying out memory from Wasm, using `.slice` calls. Please see the reference links if things get confusing. Again, I'd like to mention the type conversion is a bit unneccesary, and **should not be used in production**. This is mostly just to show how you can convert down to bytes.

Here is the wasm instantiation / audio amplification in our `index.js` below!

```javascript
const runWasm = async () => {
  // Get the importObject from the go instance.
  const importObject = go.importObject;

  // Instantiate our wasm module
  const wasmModule = await wasmBrowserInstantiate("./main.wasm", importObject);

  // Allow the wasm_exec go instance, bootstrap and execute our wasm module
  go.run(wasmModule.instance);

  // Get our exports object, with all of our exported Wasm Properties
  const exports = wasmModule.instance.exports;

  // Get our memory object from the exports
  const memory = exports.memory;

  // Create a Uint8Array to give us access to Wasm Memory
  const wasmByteMemoryArray = new Uint8Array(memory.buffer);

  // Get the pointer(s) (index) of our input/output buffers in Wasm memory
  const inputBufferPointer = exports.getInputBufferPointer();
  const outputBufferPointer = exports.getOutputBufferPointer();

  // Get the size of our input/output buffer that is located in wasm linear memory
  const inputBufferSize = exports.getInputBufferSize();
  const outputBufferSize = exports.getOutputBufferSize();

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
  // And store it at our INPUT_BUFFER_POINTER (wasm memory index)
  wasmByteMemoryArray.set(originalByteAudioSamples, inputBufferPointer);

  // Amplify our loaded samples with our export Wasm function
  exports.amplifyAudioInBuffer();

  // Slice out the amplified byte audio samples
  const outputBuffer = wasmByteMemoryArray.slice(
    outputBufferPointer,
    outputBufferPointer + outputBufferSize
  );

  // Convert our amplified byte samples into float samples,
  // and set the outputBuffer to our amplifiedAudioSamples
  amplifiedAudioSamples.set(byteSamplesToFloatSamples(outputBuffer));

  // We are now done! The "play" Functions will handle playing the
  // audio buffer
};
runWasm();
```

Next, we need to provide a way to actually play/pause the audio buffers using an [AudioBufferSourceNode](https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode). Thus, at the bottom of our `index.js` we will add:

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

And you should get something similar to the demo ([Source Code](/source-redirect?path=examples/reading-and-writing-audio/demo/go)) below! **Note:** This was a lot of Javascript getting the Audio stuff all set up, thus, I highly recommended click the demo source code link just provided to get a entire view of everything going on.

---

## Demo

<iframe width="100%" height="500px" title="Go Audio Demo" src="/demo-redirect?example-name=reading-and-writing-audio"></iframe>

And that's it for now! We will be adding "High level data structures" for Go a bit later. However, Feel free to [fix, suggest, or contribute more examples](https://github.com/torch2424/wasm-by-example)!
