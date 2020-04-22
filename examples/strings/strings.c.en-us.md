# Strings

## Overview

Let's implement the classical Caesar cipher in [C++](<https://en.wikipedia.org/wiki/C%2B%2B>) using [Emscripten](https://emscripten.org)!

---

## Tool Setup

First, let's [get the emsdk](https://emscripten.org/docs/getting_started/downloads.html) which is Emscripten's tool to get the compiler and all the tools and things you need. To do that, it's easy to get it from github using git:

```bash
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
```

Next, we can use the emsdk to get the very latest stable build of Emscripten, and to activate it so it's ready to use:

```bash
./emsdk install latest
./emsdk activate latest
```

Then locate `emscripten\emsdk\emcmdprompt.bat` and double-click it to open up a new command prompt window and initialize some temporary environment variables.

## Compiling the Code

Open your favorite text editor and save this toy cipher as `caesar.cpp`:

```cpp
// caesar.cpp
typedef long int i32;
extern "C" {
  void caesarEncrypt(i32 *plaintext, i32 plaintextLength, i32 key) {
    for (int i = 0; i < plaintextLength; i++) {
      plaintext[i] = (plaintext[i] + key) % 26;
    }
  }
  void caesarDecrypt(i32 *ciphertext, i32 ciphertextLength, i32 key) {
    for (int i = 0; i < ciphertextLength; i++) {
      ciphertext[i] = (ciphertext[i] - key) % 26;
    }
  }
}
```

We can compile that with

```bash
emcc -Os -s STANDALONE_WASM -s EXPORTED_FUNCTIONS="['_caesarEncrypt', '_caesarDecrypt']" -Wl,--no-entry "caesar.cpp" -o "caesar.wasm"
```

That emits `caesar.wasm`.

The `-Os` flag tells Emscripten to optimize our code for maximum performance. The `-s STANDALONE_WASM` flag specifies that we want pure wasm, with no JS or HTML helper files. `-Wl,--no-entry` ensures that an unnecessary `start` function isn't inserted into the binary.

The wasm file contains the compiled code, but we need to write JS to load and run it. Let's do that!

First, we load the wasm.  Since this involves async operations, we'll do everything inside an anonymous async function.

```javascript
(async () => {
  const response = await fetch('caesar.wasm');
  const file = await response.arrayBuffer();
  const wasm = await WebAssembly.instantiate(file);
```

Then we extract our wasm functions, and the memory shared between wasm and JS:

```javascript
  const { memory, caesarEncrypt, caesarDecrypt } = wasm.instance.exports;
```

Julius Caesar is recorded as having preferred a shift of 3 characters down the Latin alphabet for his encryption key. Let's do the same! We will encrypt the secret message "helloworld":

```javascript
  const plaintext = 'helloworld';
  const myKey = 3;
```

Sadly, wasm can only work with numbers (and arrays of numbers).  Fortunately, we can get around this with helper functions to handle encoding and decoding text to and from arrays of integers!  Let's write a couple functions that handle our encoding scheme where each letter corresponds to its zero-based position in the alphabet:

```javascript
  const encode = function stringToIntegerArray(string, array) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < string.length; i++) {
      array[i] = alphabet.indexOf(string[i]);
    }
  }

  const decode = function integerArrayToString(array) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let string = '';
    for (let i = 0; i < array.length; i++) {
      string += alphabet[array[i]];
    }
    return string;
  }
```

Here comes the fun part.  We create a typed array which acts as a sort of window into the memory shared between JS and wasm.  This will allow us to send and retrieve our encoded text to and from the functions we wrote in C++!

```javascript
  const myArray = new Int32Array(memory.buffer, 0, plaintext.length);
```

That second argument, `0`, means our array begins at the very beginning of our shared memory.  In C++ you would call it a pointer.  Now we encode our secret message in order to prepare it for encryption:

```javascript
  encode(plaintext, myArray);
```

Our encode function doesn't return anything; it just inserts the encoded letters into our array.  Let's check:

```javascript
  console.log(myArray);         // Int32Array(10) [7, 4, 11, 11, 14, 22, 14, 17, 11, 3]
  console.log(decode(myArray)); // helloworld
```

Looks good!  Now that our encoded plaintext exists in our shared memory, we can call our encrypt function to tell the wasm to encrypt it:

```javascript
  caesarEncrypt(myArray.byteOffset, myArray.length, myKey);
```

That first argument refers to same value as the pointer we talked about earlier. Did it work?  Let's see:

```javascript
  console.log(myArray);         // Int32Array(10) [10, 7, 14, 14, 17, 25, 17, 20, 14, 6]
  console.log(decode(myArray)); // khoorzruog
```

Looks like all is going according to plan, and our highly confidential message has been secured.  Let's pretend we are the intended recipient (we are, after all), and try decrypting it with the same key:

```javascript
  caesarDecrypt(myArray.byteOffset, myArray.length, myKey);
  console.log(myArray);         // Int32Array(10) [7, 4, 11, 11, 14, 22, 14, 17, 11, 3]
  console.log(decode(myArray)); // helloworld
})();                           // don't forget to close that async function!
```

Awesome!  

If you wrap this code between `<script></script>` tags inside an `.html` file, you can run it if it's hosted on a webserver, like localhost.  It won't work if you simply open the file directly.  This is because of security precautions that prevent your browser from loading files (`caesar.wasm`, in this case) straight from your harddrive.

## Demo

<iframe width="350px" height="200px" title="C++ Demo" src="/demo-redirect?example-name=strings"></iframe>