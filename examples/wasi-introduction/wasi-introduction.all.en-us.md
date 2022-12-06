## WASI Introduction

First, we should answer the question, "What is WASI"? The formal answer to this is: WASI is the [WebAssembly System Interface](https://wasi.dev/), "a modular system interface for WebAssembly". To provide an easy introduction into why the idea of WASI is exciting, let's look at some possible use cases when the goals of WASI are met:

- **What can developers do with WebAssembly/WASI?**
  - **Cross platform applications and games:** you could imagine where you have have a single binary or executable, that is then able to be run on any platform that has has a WebAssembly runtime. Allowing for cross platform applications, all running from a single released file.
  - **Code re-use between platforms and use cases:** you could imagine code re-use across your application architecture between different platforms, such as a client and the server, mobile and desktop, or even IOT devices. Or if you are writing a library, writing a cross platform wrapper by implementing a thin "WASI Shell".
  - **Running applications written in any Wasm/Wasi-compilable language on a single runtime:** Meaning instead of having multiple language specific runtimes, you could compile all of your different projects to the same target, and have a single runtime to run them all!
  - **"Containerizing" applications and their dependencies as a single target:** Per the last point, an application, and it's depencies, all being compiled into a single (or multiple) WebAssembly files. Therefore, you could imagine no longer needing a container to wrangle all of your dependencies into a single unit, they all become WebAssembly run on a runtime. This would come with benefits such as better usabilty, and less/no container overhead. This would not be a replacement for containerization, but could be a better option for applications.
  - **And Many More!**

It is important to note **These are high-level use-case examples, not all of these use cases can be done with the current version of WASI**, and we will be covering how WASI is still in progress and being standardized. However, now that we have a high level idea of what WASI can unlock for developers, lets start diving into the details on how this works:

- **How does WASI offer additional features WebAssembly Applications?**
  - **The TL;DR of WASI is:** it allows you to run WebAssembly outside of the browser.
  - WASI offers a [standardized set of APIs](https://github.com/WebAssembly/WASI/blob/master/phases/snapshot/docs.md) for WebAssembly modules to access system resource such as a FileSystem, Networking, Time, Random, etc... .
- **How do WebAssembly modules use WASI?**
  - A WebAssembly module will use their imports ([Similar to how we do this in the browser using the `importObject` with JavaScript in the "Importing Javascript Functions Into Webassembly"](/example-redirect?exampleName=importing-javascript-functions-into-webassembly)), to be able to access the standardized WASI API bindings (meaning the names of these importObject functions map directly to the agreed-upon WASI implementation).

I also think it'd be worth getting some key terms out of the way. This will make it a lot easier to speak about using WebAssembly outside of the browser with WASI. And paint a fuller picture of what was just explained above:

- **"Hosts"**
  - Hosts are the WebAssembly Runtimes that run your WebAssembly modules. In our earlier, browser focused examples, this would be the WebAssembly implementation in your web browser (for example, Google Chrome's V8).
  - When running WebAssembly outside of the server, unlike the browser, you often do not need a full browser engine with support for HTML, CSS, JavaScript, etc... So there are a few popular standalone WebAssembly runtimes / interpreters that you can use as a host, such as:
    - [Wasmtime](https://wasmtime.dev/)
    - [Lucet](https://github.com/bytecodealliance/lucet)
    - [Wasmer](https://wasmer.io/)
    - [Wasm3](https://github.com/wasm3/wasm3)
  - Most WebAssembly runtimes / interpreters can be used as a command line interface, or embedded/linked in a larger application by using it's library API.
  - Each of these projects has their own strengths, and it really depends on what your use case is to choose the best host for you. And there are many more projects out there that you can choose from!
- **"Guests"**
  - Guests are the WebAssembly modules that are executed by the host. If you plan to write WebAssembly modules, then you would be writing the guest application that is running inside the host application.
  - The host is able to provide additional functionality to guest, by doing tasks on the guests' behalf. This functionality is offered by passing functions to the importObject ([Similar to how we do this for the browser in the "Importing Javascript Functions Into Webassembly"](/example-redirect?exampleName=importing-javascript-functions-into-webassembly)).
  - This brings us back to WASI, as WASI is a standardized set of APIs for hosts to do system level actions (such as filystem operations) for the guest WebAssembly module. Therefore, this allows developers to write WebAssembly modules that can access system resources!

The last thing worth mentioning is that WASI uses a [capability based security model](https://github.com/bytecodealliance/wasmtime/blob/master/docs/WASI-capabilities.md). Meaning, the host must explicitly grant a capability to a guest module in order for the guest module to perform an action. For example in [Wasmtime](https://wasmtime.dev/), by default, the guest module cannot access any part of the host's filesystem. The user that invokes Wasmtime must pass in the `--mapdir` or `--dir` flag to grant modules the capability to access directories in the host filesystem.

At the time of this writing, a lot of WASI is still in proposals and things. Other system resources, like networking, are not yet part of the WASI standard, though they will be one day. So, if you're hoping to `bind()` to a socket in your WebAssembly module, WASI hosts don't yet expose those capabilities. Only a few features of what WASI is hoping to acheive is fully implemented and standardized. One of those features is filesystem access!

Therefore, let's take a look at modifying the file system in the [WASI hello world example](/example-redirect?exampleName=wasi-hello-world), if there is a hello world currently for your language. If not, feel free to look at your language documentation, to see if they support WASI currently, and submit the [WASI hello world example for your language](https://github.com/torch2424/wasm-by-example).
