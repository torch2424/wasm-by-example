## WASI Introduction

First, we should answer the question, "What is WASI"? WASI is the [WebAssembly System Interface](https://wasi.dev/), "a modular system interface for WebAssembly". To help explain this, let's break it down to:

- **What can WASI do for my WebAssembly Applications?**
  - WASI offers a standardized set of APIs for WebAssembly modules to access system resource such as a FileSystem, Networking, Time, Random, etc... .
- **How do WebAssembly modules use WASI?**
  - A WebAssembly module will use their importObject ([Similar to how we do this for the browser in the "Importing Javascript Functions Into Webassembly"](/example-redirect?exampleName=importing-javascript-functions-into-webassembly)), to be able to access the standardized WASI API bindings (meaning the names of these importObject functions map directly to the agreed-upon WASI implementation).

I also think it'd be worth getting some key terms out of the way. This will make it a lot easier to speak about using WebAssembly outside of the browser with WASI. And paint a fuller picture of what was just explained above:

- **"Hosts"**
  - Hosts are the WebAssembly Runtimes that run your WebAssembly modules. In our earlier, browser focused examples, this would be the WebAssembly implementation in your web browser (for example, Google Chrome's V8).
  - When running WebAssembly outside of the server, unlike the browser, you often do not need a full browser engine with support for HTML, CSS, JavaScript, etc... So there are a few popular standalone WebAssembly runtimes / interpreters that you can use as a host, such as:
    - [Wasmtime](https://wasmtime.dev/)
    - [Lucet](https://github.com/bytecodealliance/lucet)
    - [Wasmer](https://wasmer.io/)
    - [Wasm3](https://github.com/wasm3/wasm3)
  - Most WebAssembly runtimes / interpreters can be used as a command line interface, or embedded/linked in a larger application by using it's library API.
  - Each of these projects has their own strengths, and it really depends on what your use case is to choose the best host for you. And there are many more projects out there that you can choose from! For example, here is a [WASI awesome list](https://github.com/wasmerio/awesome-wasi).
- **"Guests"**
  - Guests are the WebAssembly modules that are executed in the host. If you plan to write WebAssembly modules, than you would be writing the guest application that is run inside the host application.
  - The host is able to provide additional functionality to guest, by doing tasks on the guests' behalf. This functionality is offered by passing functions to the importObject ([Similar to how we do this for the browser in the "Importing Javascript Functions Into Webassembly"](/example-redirect?exampleName=importing-javascript-functions-into-webassembly)).
  - This brings us back to WASI, as WASI is a standardized set of APIs for hosts to do system level actions (such as filystem operations) for the guest WebAssembly module. Therefore, this gives guest WebAssembly modules that a developer could write, access to system resources!

The last thing worth mentioning is that WASI uses a [capability based security model](https://github.com/bytecodealliance/wasmtime/blob/master/docs/WASI-capabilities.md). Meaning, hosts must be explicitly given a capability, before it will allow a guest module to perform an action. For example in [Wasmtime](https://wasmtime.dev/), a guest module cannot modify the filesystem, without using the `--mapdir` or `--dir` flag which explictly says which directory on the host (your runtime / computer filesystem) maps to the guest (the webassembly module's virtual filesystem provided by the host).

At the time of this writing, a lot of WASI is still in proposals and things. Only a few features of what WASI is hoping to acheive is fully implemented and standardized. One of those features is filesystem access! Therefore, let's take a look at modifying the file system in the [WASI hello world example](/example-redirect?exampleName=wasi-hello-world).
