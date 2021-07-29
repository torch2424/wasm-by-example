# WASI Hello World

## Overview

In this example, We will be writing "Hello world!" to both the console (`stdout`), and a newly created file `helloworld.txt`. We highly reccomended that you have read the [WASI Introduction](/example-redirect?exampleName=wasi-introduction&programmingLanguage=all) before procedding with this example. You should install [wasmtime](https://wasmtime.dev/) as that is the WebAssembly runtime we will be using as our host.

---

## Implementation

First, we will create a new `main.go` file, with the following code:

```go
package main

// Import "fmt" from the Go Standard library to write to standard out
// Import "io/ioutil" from the Go Standard library to write to the filesystem
import (
  "fmt"
  "io/ioutil"
)

func main() {
  // Print out hello world!
  // This will handle writing to stdout for us using the WASI APIs (e.g fd_write)
  fmt.Println("Hello world!")

  // Get our hello world string as bytes, so we can write the string using ioutil
  helloWorldAsBytes := []byte("Hello world!\n")

  // We are writing a `helloworld.txt` file
  // This code requires the Wasi host to provide a directory on the guest.
  // For example, in Wasmtime, if you want to access to the current directory,
  // invoke the wasmtime with the flag/argument: `--dir .`
  err := ioutil.WriteFile("./helloworld.txt", helloWorldAsBytes, 0644)

  // If err is not nil, that means we could not create/write the file
  // (Probably because we did not add the `--dir` flag on our wasmtime command)
  if err != nil {
    panic(err)
  }
}
```

As mentioned in the code comments, even though the [WASI APIs](https://github.com/WebAssembly/WASI/blob/master/phases/snapshot/docs.md) are not being used directly, when we compile our program to WASI, TinyGo will be calling the host functions for us through it's standard library functions.

Next, Let's compile our `main.go` into a Wasm module that targets WASI!

This can be down with the `-wasm-abi=generic` and `-target=wasi` flags when you run the TinyGo compiler:

```bash
tinygo build -wasm-abi=generic -target=wasi -o main.wasm main.go
```

Which should output (`-o`) a `main.wasm` file that we can run in a WebAssembly runtime that supports WASI!

> **NOTE:** As of July, 2021 goroutines and other language features may be in a funny place in terms of WASI support. Thus, if this is something you are trying to support it is worth playing around with the `-scheduler` and `-gc` compiler flags. For example, it may be worth adding the flags `"-scheduler=none -gc=conservative"` or `"-scheduler=coroutines -gc=leaking"` flag combination to a simple TinyGo compilation. (E.g `tinygo build -wasm-abi=generic -target=wasi -scheduler=coroutines -gc=leaking -o main.wasm main.go`).

Now that we have our Wasm Module that targets WASI, we can run the module using the Wasmtime CLI. We mentioned wasmtime should be installed at the beginning of this tutorial. However, there is one thing to note that was mentioned in the code comments. **We need to give our program explicit access to create files on our host, because our program creates a new file**. As mentioned in the [WASI Introduction](/example-redirect?exampleName=wasi-introduction), our guest will not have this capability unless we give them the capability.

Thus, when we use the Wasmtime CLI to run our wasm module, we should pass the `--dir .` flag. This grants wasmtime the capability to read/write files in the current directory (`.`).

Finally, let's run our Wasm module with the Wasmtime CLI:

```bash
wasmtime --dir . main.wasm
```

You should then see "Hello World!" logged in your terminal. You should also notice that a `helloworld.txt` file was created in your current directory, with the contents of "Hello World!".

Yay! We have successfully written our first WASI module!

---

WASI is still growing, and there are a lot of projects that are taking advantages of WASI to do interesting things! You can see some examples of projects written for, or ported to WebAssembly using WASI, by searching "WASI" on [Made with WebAssembly](https://madewithwebassembly.com/).

Feel free to [fix, suggest, or contribute more examples](https://github.com/torch2424/wasm-by-example)!
