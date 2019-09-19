# Hello World!

## Overview

Let's do a "Hello world" type of program in [C](<https://en.wikipedia.org/wiki/C_(programming_language)>) using [Emscripten](https://emscripten.org)!

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
source ./emsdk_env.sh
```

The last command sets up the path so it can find `emcc`, the Emscripten compiler tool, and everything else we need.

## Compiling the Code

Open your favorite text editor and save this little hello world program as `hello.c`:

```c
// hello.c
#include <stdio.h>

int main() {
  printf("hello, world!\n");
  return 0;
}
```

We can compile that with

```bash
emcc hello.c -o hello.js
```

That emits `hello.js` and `hello.wasm`. The wasm file contains the compiled code, while the JS has all the code to load and run it. By default Emscripten output supports running both on the Web and in Node.js, so let's do that:

```bash
node hello.js
```

That will print `hello, world!` as expected.

You can also tell `emcc` to optimize the code - very important for code size - and also to emit HTML for you, for example like this:

```bash
emcc hello.c -O3 -o hello.html
```

You can then run a local webserver (like `python -m SimpleHTTPServer 8000`) and browse to `localhost:8000/hello.html`, where you'll see the expected output.
