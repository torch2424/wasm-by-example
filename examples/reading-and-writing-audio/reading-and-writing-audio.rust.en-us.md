# Audio

## Overview

**NOTE: This demo "idea" should not be used in production. As well as the manual type conversions. This is just for learning purposes. The text will contain mentions of when something should not be used.**

As stated before, **WebAssembly is a great fit for computationally intensive tasks**. For example, Tasks that involve things like big data, heavy logic with conditionals, or nested looping. Thus, generating / rendering audio samples **can** get a significant speedup by moving these mentioned parts into WebAssembly. In this example, we will be amplifying audio samples from an [AudioBuffer](https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer) using the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API). **Note:** This functionality can and should be done through a [Gain Node](https://developer.mozilla.org/en-US/docs/Web/API/GainNode), but this is mostly for demoonstration purposes. **A more realistic (albeit more complicated and not fit for a demo) use case**, would be to implement unsupported Web Audio API effects like a [bitcrusher](https://github.com/jaz303/bitcrusher) ([Example Video](https://youtu.be/bVcpCswqCXA?t=10)), or a [ogg decoder for unsupported browsers](https://en.wikipedia.org/wiki/HTML5_audio#Supported_audio_coding_formats).

**Another Note:** This example will continue to build on our simple buffer/pointer memory passing. This could be implemented using higher-level data structures, and these data structures will be covered in later examples.

So let's get into the example:

---

## Implementation

Before starting implementation, if you are not familiar with digital audio, or how it works, I'd highly suggest watching this [video on "How Digital Audio Works" by Computerphile](https://www.youtube.com/watch?v=1RIA9U5oXro). But a quick TL;DR, Digital Audio can be represented by a one dimensional array, containing positive (1.0) and negative (-1.0) signals. Where the index of the array represents time, and the value represents the signal (positive or negative), and the volume (e.g 0 -> 1.0).

As usual, let's get started with our `src/lib.rs` file. You will notice here we set up a buffer, similar to the [WebAssembly Linear Memory example](/example-redirect?exampleName=webassembly-linear-memory). In order to pass back our pixel values into Javascript, we will write these values into Wasm Memory. That way, Javascript can read them later. Please be sure to read the comments in the following code examples, and be sure to follow links or look at previous examples if something does not make sense. Let's get into it:

```rust
// Add the wasm-pack crate
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

Next, we can compile the module following the [Hello World](/example-redirect?exampleName=hello-world) examples compilation process, replacing the appropriate file names.

Next, let's create an `index.js` file. In the begginning of this file, we will need to set up our [AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext), as well as a bunch of buffers and things that we will use later:

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

// Create an AudioBufferSourceNode.
// This is the AudioNode to use when we want to play an AudioBuffer,
// Set the buffer to our buffer source,
// And loop the source so it continuously plays
const audioBufferSource = audioContext.createBufferSource();
audioBufferSource.buffer = audioBuffer;
audioBufferSource.loop = true;

// Connect our source to our output
audioBufferSource.connect(audioContext.destination);

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

Next, Let's load / instantiate the wasm module, `audio_bg.wasm` in our `index.js`, and perform our actual audio generation and amplification. Again, we will follow the module instantiation from the [Hello World](/example-redirect?exampleName=hello-world) example. A lot of the logic here is expanding on the [WebAssembly Linear Memory Example](/example-redirect?exampleName=webassembly-linear-memory), but applying the learnings to a DOM API. The most important thing here is probably how we are copying out memory from Wasm, using `.slice` calls. Please see the reference links if things get confusing. Again, I'd like to mention the type conversion is a bit unneccesary, and **should not be used in production**. This is mostly just to show how you can convert down to bytes.

Here is the wasm instantiation / audio amplification in our `index.js` below!

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

    // Start the audio source (Will play silence for now)
    audioBufferSource.start();

    // We are now done! The "play" Functions will handle swapping in the
    // correct audio buffer

};
runWasm();
```

Next, we need to provide a way to actually play/pause the audio buffers. Thus, at the bottom of our `index.js` we will add:

```javascript
function beforePlay() {
  // Check if context is in suspended state (autoplay policy)
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}

window.playOriginal = () => {
  beforePlay();
  // Set the float audio samples to the left and right channel
  // of our playing audio buffer
  audioBuffer.getChannelData(0).set(originalAudioSamples);
  audioBuffer.getChannelData(1).set(originalAudioSamples);
};

window.playAmplified = () => {
  beforePlay();
  // Set the float audio samples to the left and right channel
  // of our playing audio buffer
  audioBuffer.getChannelData(0).set(amplifiedAudioSamples);
  audioBuffer.getChannelData(1).set(amplifiedAudioSamples);
};

window.pause = () => {
  beforePlay();
  // Create/Set the buffer to silence
  const silence = [];
  silence.length = numberOfSamples;
  silence.fill(0);
  audioBuffer.getChannelData(0).set(silence);
  audioBuffer.getChannelData(1).set(silence);
};
```

Finally, let's make sure we have the following to our `index.html` to provide buttons to call our play/pause functions so we can actually play our audio:

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

And you should get something similar to the demo ([Source Code](/source-redirect?path=examples/reading-and-writing-audio/demo/rust)) below! **Note:** This was a lot of Javascript getting the Audio stuff all set up, this I highly reccomended click the demo source code link just provided to get a entire view of everything going on.

---

## Demo

<iframe width="300px" height="400px" title="Rust Audio Demo" src="/examples/reading-and-writing-audio/demo/rust/"></iframe>
