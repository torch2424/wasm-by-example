# WASI Hello World

## Overview

In this example, We will be writing "Hello world!" to both the console (`stdout`), and a newly created file `hello-world.txt`. We highly reccomended that you have read the [WASI Introduction](/example-redirect?exampleName=wasi-introduction&programmingLanguage=all) before procedding with this example. You should install [wasmtime](https://wasmtime.dev/) as that is the WebAssembly runtime we will be using as our host.

---

## Implementation

First, we will start a new AssemblyScript project (Must be at least AssemblyScript version 0.18.0):

```bash
$ npm install -g assemblyscript
$ asinit wasi-hello-world
$ cd wasi-hello-world
```

Next, let's install [as-wasi](https://github.com/jedisct1/as-wasi). `as-wasi` is an easy to use API for the AssemblyScript WASI bindings. The bindings being, the declared functions that map to the WASI host functions. To install as-wasi, we can run:

`npm install --save as-wasi`

Then, we will open the `assembly/index.ts` and enter the following contents. Please see the comments to understand what our program will be doing:

```typescript
// As of AssemblyScript 0.10.0, adding `import "wasi"`, will automatically
// import WASI bindings, and add some nice defaults for compiling to WASI.
import "wasi";

// Import Console (for writing to stdout), and FileSystem (for reading/writing files)
// from "as-wasi". An API for working with WASI in AssemblyScript much easier.
import { Console, FileSystem, Descriptor } from "as-wasi";

// Print out hello world!
// This will handle writing to stdout for us using the WASI APIs (e.g fd_write)
Console.log("Hello World!");

// We are creating/opening a `helloworld.txt` file
// This code requires the Wasi host to provide a directory on the guest.
// For example, in Wasmtime, if you want to access to the current directory,
// invoke the wasmtime with the flag/argument: `--dir .`
// FileSystem.open will return null if it fails to create/open the file
let filePath: string = "helloworld.txt";
let fileOrNull: Descriptor | null = FileSystem.open(filePath, "w+");

// Check if the FileSystem.open() returned null.
// If fileOrNull is null, that means we could not create/open the file
// (Probably because we did not add the `--dir` flag)
// Throw an error.
if (fileOrNull == null) {
  throw new Error("Could not open the file " + filePath);
}

// Change our type from Descriptor | null, to Descriptor, as we checked above.
// Meaning, we were able to successfully open/create the file
let file = changetype<Descriptor>(fileOrNull);

// Write "Hello World!" to the file.
file.writeStringLn("Hello World!");
```

As mentioned in the code comments, even though the [WASI APIs](https://github.com/WebAssembly/WASI/blob/master/phases/snapshot/docs.md) are not being used directly, when we compile our program to WASI, the as-wasi will be calling the host functions for us.

Next, let's add some helpful npm script to our `package.json`. Your Package JSON should have the same contents (ignoring the dependency versions if you are reading this in the future):

```json
{
  "scripts": {
    "build": "asc assembly/index.ts -b build/index.wasm -t build/index.wat",
    "start": "wasmtime --dir . build/index.wasm"
  },
  "dependencies": {
    "as-wasi": "^0.4.6",
    "assemblyscript": "^0.19.9"
  }
}
```

The "build" npm script will handle compiling `assembly/index.ts` with the AssemblyScript compiler. So let's build our module with:

```bash
npm run build
```

We should then have our built wasm module in: `build/index.wasm`. Yay!

The "start" npm script will handle running our build WebAssembly modules with the Wasmtime CLI. We mentioned wasmtime should be installed at the beginning of this tutorial. However, there is one thing to note that was mentioned in the code comments. **We need to give our program explicit access to create files on our host, because our program creates a new file**. As mentioned in the [WASI Introduction](/example-redirect?exampleName=wasi-introduction), our guest will not have this capability unless we give them the capability.

You will notice the "start" script calls the wasmtime with the `--dir .` flag. This grants wasmtime the capability to read/write files in the current directory (`.`).

Finally, let's run our "start" script to get our results:

```bash
npm run start
```

You should then see "Hello World!" logged in your terminal. You should also notice that a `helloworld.txt` file was created in your current directory, with the contents of "Hello World!".

Yay! We have successfully written our first WASI module.

---

WASI is still growing, and there are a lot of projects that are taking advantages of WASI to do interesting things! You can see some examples of projects written for, or ported to WebAssembly using WASI, by searching "WASI" on [Made with WebAssembly](https://madewithwebassembly.com/).

Feel free to [fix, suggest, or contribute more examples](https://github.com/torch2424/wasm-by-example)!
