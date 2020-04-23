# Passing High Level Data Types with `as-bind`

## Overview

Using buffers and pointers, is a great way to get started with WebAssembly, and drill in its concepts while being productive. But once we start wanting to use higher level data structures efficiently and easily, is where things will get a little more complicated. Thankfully, the AssemblyScript community built [as-bind](https://github.com/torch2424/as-bind), which is a convenient abstraction over [AssemblyScript's loader](https://github.com/AssemblyScript/assemblyscript/tree/master/lib/loader). As mentioned before, `as-bind` abstracts away linear memory, and allows using higher-level data structures between AssemblYScript and JavaScript.

Let's kick things off! To show off how we can use `as-bind`, let's see how we can use strings in WebAssembly and share them with JavaScript:

---

## Implementation

First, we will need to install as-bind into our JavaScript project. If you do not currently have a modern JavaScript project, you can use [`asinit`](https://docs.assemblyscript.org/quick-start) to generate one. After you have generated your project, you can install as-bind by running:

```bash
npm i --save as-bind
```

First, let's add the following to our `assembly/index.ts` file:

```typescript
export function addWasmByExample(inputString: string): string {
  return inputString + "Wasm By Example";
}
```

What you will notice that is interesting, in other examples we've had to ensure all of our exported functions returned a supported WebAssembly number type. Now that we will be using as-bind, we can export a function that returns a string!

Now, let's compile our assemblyscript. [as-bind has an entry file](https://github.com/torch2424/as-bind#quick-start) that must be included when compiling your AssemblyScript. Therefore, we would run:

`asc ./node_modules/as-bind/lib/assembly/as-bind.ts assembly/index.ts -b addWasmByExample.wasm`

Next, lets modify our `index.js` file to load and run our wasm output. We will be utilizing as-bind in our JavaScript as described in the [as-bind quick-start](https://github.com/torch2424/as-bind#quick-start). Let's dive into our resulting `index.js`:

```javascript
// We are including as-bind from the npm CDN unpkg. If you use a JavaScript bundler, you could use "as-bind".
import { AsBind } from "https://unpkg.com/as-bind@0.3.1/dist/as-bind.esm.js";

const wasm = fetch("./addWasmByExample.wasm");

const asyncTask = async () => {
  const asBindInstance = await AsBind.instantiate(wasm);

  // You can now use your wasm / as-bind instance!
  const response = asBindInstance.exports.addWasmByExample("Hello from ");
  console.log(response); // Hello from Wasm By Example
};
asyncTask();
```

Another nice thing to notice, as-bind will handle our WebAssembly instantion for us! This is because during as-bind's instantiation step, it is wrapping our export function calls with their own as-bind function calls. The original exports can still be accessed at: `asBindInstance.unboundExports`.

Lastly, lets create an `index.html` similar to one described in the [hello-world](/example-redirect?example-name=hello-world), and load our `index.js` Javascript file in our `index.html`. Then, you should get something similar to the demo ([Source Code](/source-redirect?path=examples/passing-high-level-data-types-with-as-bind/demo/assemblyscript)) below!

---

## Demo

<iframe width="350px" height="200px" title="AssemblyScript Demo" src="/demo-redirect?example-name=passing-high-level-data-types-with-as-bind"></iframe>

---

**[as-bind](https://github.com/torch2424/as-bind) has support for many different types!** I'd highly reccomend reading the as-bind README, and in particular, the section of the [supported types by as-bind](https://github.com/torch2424/as-bind#supported-data-types).

Feel free to [fix, suggest, or contribute more examples for language features or communitty tools](https://github.com/torch2424/wasm-by-example)!
