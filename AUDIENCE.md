# WasmByExample Audience

This doc gives an overview, of what kind of developer WasmByExample is written for. This is useful for maintainers and contributors to have a clear guide on some of the assumptions and concepts can be used at a lower, or higher level, detail.

This doc dives deep into who our audience is, and why it could be perceived that way. However, The **TL;DR** of this doc is:

1. WebAssembly is probably going to be a learning step for intermediate-level developers.
1. Developers coming from different ecosystems will have have different assumptions:
1. AssemblyScript users are probably strong with JavaScript. Focus more on AssemblyScript syntax, AssemblyScript features, and communication between JavaScript and WebAssembly.
1. Rust users are probably knowledgeable in Rust, or are JavaScript developers learning Rust for the first time. Direct JavaScript users towards general Rust resources like the Rust book to learn Rust. Other than that, focus on the tooling around Rust/Wasm like [wasm-pack](https://github.com/rustwasm/wasm-pack), and [wasm-bindgen](https://github.com/rustwasm/wasm-bindgen). Also, be sure to explain what Rust is generating for JavaScript and why, as they may not be familiar with modern web development.
1. C / C++ users are probably very knowledgeable in C / C++, but may not be comfortable with emscripten. Focus on explaining what configuration options and flags are doing, and why they are needed.

Now, let's explain our decisions on our audience:

## WebAssembly is an Intermediate Learning Step for Developers

WebAssembly, in its current form, is mostly attracting people of web backgrounds, systems language backgrounds, or a combination of both (Web Game Developers). Let's expand a bit on each, and explain why **WebAssembly is a learning step for intermediate developers in their respective backgrounds**.

### Web Background Developers

Let's say you are from a web background. Traditionally you would learn (In this order, somewhat):

1. HTML - For building layouts
2. Css - For making those layouts look good
3. Javascript - For adding interactions to those layouts

In my opinion, WebAssembly would be the next step, step 4. In which, WebAssembly adds "compuationally intensive tasks to be completed per an interaction with a layout". Therefore, I think we can somewhat assume, **a frontend web developer will have their fundamentals down, and probably have a react app or two under their belt before coming to the docs**. And with this assumption for the case of AssemblyScript, they should at least have heard of TypeScript, and understand it is JavaScript with types. Which according to [The State of JS, 2019](https://2019.stateofjs.com/javascript-flavors/typescript/) is a very safe assumption to make.

### Systems Language Backround Developers

So if you are developer learning / are already know a systems level language, I think WebAssembly is "another compile target" for your code.

In order to learn something like Rust, you probably compiled your hello world or whatever it may be, to your host machine, before trying to make it work outright with WebAssembly. Rust does present an interesting case, as "a lot" of non-systems language programmers are learning rust to compile directly to WebAssembly to learn Wasm. And I think this is something we should defiintely clarify. Especially because Rust already has a big learing curve, and I think Wasm will only make it (slightly) steeper. Therefore, **for Rust, let's clarify to the audience we expect them to already be familiar with some concepts, and have read through some of the book and have made some Hello World and other beginner programs before trying to jump straight into WebAssembly."**

I'd still argue for the case of something like Emscripten or C, the developer most likely did not learn C, but is already comfortable with C, and is reaching for Emscripten, or any other toolchain, to compile for the web. Which currently seems to be the story companies are pushing anyways. Therefore, **For C, let's assume the user knows C already decently well, but it may be their first time playing with Emscripten. Thus, we just need to be clear on what flag does what more than actually explaining what a buffer is and things."**

## Writing Examples for each Audience on each Toolchain

Now that we have established (at least somewhat), where a developer may be in their knowledge when learning WebAssembly, lets dive into the expected background when a developer chooses a toolchain, and how the example's voice should reflect that.

### AssemblyScript

I personally see (and open for discussion) a lot of web devs getting into AssemblyScript. Thus, let's assume the developer is comfortable with things like NPM, and TypeScript. But just needs a bit of hand holding around the JS -> Wasm bridge, the runtime, and the parts where AssemblyScript is different than JavaScript or TypeScript. We don't have to go over specific syntax features, but the way objects are handled (#56) is a little bit different compared to your normal web workflow.

Therefore, examples should docus more on AssemblyScript syntax, AssemblyScript features, and communication between JavaScript and WebAssembly.

### Rust

Rust is interesting as I covered before. And to avoid re-iterating, let's go with: "**For Rust, let's clarify to the audience we expect them to already be familiar with some concepts, and have read through some of the book and have made some Hello World and other beginner programs before trying to jump straight into WebAssembly.**" And with this, we should use tools like wasm-pack and things that kind of hand hold both the Web and Rust developer, as they help both audiences quite a bit in the learning process. That being said though, for non-web Rust developers, we may actually want to expand a bit more on NPM, and general HTML and CSS as it may not be something they are not strong at.

Direct JavaScript users towards general Rust resources like the Rust book to learn Rust. Other than that, focus on the tooling around Rust/Wasm like [wasm-pack](https://github.com/rustwasm/wasm-pack), and [wasm-bindgen](https://github.com/rustwasm/wasm-bindgen). Also, be sure to explain what Rust is generating for JavaScript and why, as they may not be familiar with modern web development.

### Emscripten (C / C++)

**For C, let's assume the user knows C already decently well, but it may be their first time playing with Emscripten. Thus, we just need to be clear on what flag does what more than actually explaining what a buffer is and things."**. So let's just show Emscripten stuff, and how it works, rather than concepts like pointers and buffers. Though, we may actually want to expand a bit more on NPM, and general HTML and CSS as it may not be something they are not strong at.

Focus on explaining what configuration options and flags are doing, and why they are needed.
