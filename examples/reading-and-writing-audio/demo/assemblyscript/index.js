// Imports are from the demo-util folder in the repo
// https://github.com/torch2424/wasm-by-example/blob/master/demo-util/

import { wasmBrowserInstantiate } from "/demo-util/instantiateWasm.js";

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

const runWasm = async () => {
  // Instantiate our wasm module
  const wasmModule = await wasmBrowserInstantiate(
    "/examples/audio/demo/assemblyscript/index.wasm"
  );

  // Get our exports object, with all of our exported Wasm Properties
  const exports = wasmModule.instance.exports;

  // Get our memory object from the exports
  const memory = exports.memory;

  // Create a Uint8Array to give us access to Wasm Memory
  const wasmByteMemoryArray = new Uint8Array(memory.buffer);

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
  wasmByteMemoryArray.set(
    originalByteAudioSamples,
    exports.INPUT_BUFFER_POINTER.valueOf()
  );

  // Amplify our loaded samples with our export Wasm function
  exports.amplifyAudioInBuffer();

  // Slice out the amplified byte audio samples
  const outputBuffer = wasmByteMemoryArray.slice(
    exports.OUTPUT_BUFFER_POINTER.valueOf(),
    exports.OUTPUT_BUFFER_POINTER.valueOf() +
      exports.OUTPUT_BUFFER_SIZE.valueOf()
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
