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

const go = new Go(); // Defined in wasm_exec.js. Don't forget to add this in your index.html.

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
