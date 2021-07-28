# Classes in AssemblyScript

## Overview

Like TypeScript, AssemblyScript offers several OOP features such as classes and
inheritance. You can create classes in AssemblyScript, and then use tools such as asbind, or the AssemblyScript loader to access those classes from JavaScript. In this
tutorial, I am going to walk you through creating a class and subclass in AssemblyScript
and then using as-bind to create objects from those classes within JavaScript. The first
thing we should do is install the as-bind module using `npm`:

```bash
npm install --save as-bind
```

Later in this tutorial, we will need to include the as-bind library when we compile our WebAssembly
module. Let’s create a class called `Vector2D`, which is a vector in 2D space with a
directional `x` and `y` component. We will then create a second class called `Vector3D` that
extends `Vector2D` adding a `z` and `w` component. Create a file called `ASBindTest.ts` and
add the following code:

```typescript
// Vector2D is a mathematical vector in 2D space.
// It has an x and y directional component and a magnitude
export class Vector2D {
  // x and y directional component of the vector
  x: i32;
  y: i32;
  // constructor for initializing the x and y components
  constructor(x: i32, y: i32) {
    this.x = x;
    this.y = y;
  }

  // the squared magnitude of the vector
  MagSQ(): i32 {
    return this.x * this.x + this.y * this.y;
  }

  // getting the magnitude of the vector
  Magnitude(): f32 {
    return f32.sqrt(<f32>this.MagSQ());
  }
}

export class Vector3D extends Vector2D {
  // This adds a z attribute to the x and y attributes inherited from Vector2D
  z: i32;

  // I know It’s not technically a 3D vector if it has a w component :-p
  // I have this w component as a private attribute to demonstrate that
  // it will not be exported
  private w: i32;
  constructor(x: i32, y: i32, z: i32) {
    super(x, y); // calls the original constructor
    this.z = z;
    this.w = 0;
  }
  // This calls the Vector2D MagSQ function and adds the z component
  MagSQ(): i32 {
    return super.MagSQ() + this.z * this.z;
  }
  // Adding the Magnitude method to Vector3D would be unnecessary in TypeScript
  // AssemblyScript has no virtual function lookups, so Magnitude must be
  // overridden with the exact same code. Otherwise MagSQ would be called
  // on the Vector2D class instead of the Vector3D class.
  Magnitude(): f32 {
    return f32.sqrt(<f32>this.MagSQ());
  }
}
// I’m creating this Vector3D object to show that private variables in
// AssemblyScript are not so private. AssemblyScript does not yet enforce
// access level modifiers like public, private and protected.
let v = new Vector3D(3, 4, 5);

// even though w is private, AssemblyScript does not prevent you from updating
v.w = 1;
```

As you can see, there are currently some limitations to OOP within AssemblyScript. Many
of these limitations are because several language features are still under construction.
Classes in AssemblyScript can not yet implement an interface. AssemblyScript does not
enforce access level modifiers such as `public`, `private`, and `protected`. The `private`
keyword does prevent a public class from exporting the attribute or method to JavaScript,
but that is all. Now that we have our AssemblyScript written, we need to compile it into a
WASM module. To use `as-bind`, we have to include the `as-bind` compiler transform that we installed
using `npm`. Use this `asc` command to compile the WASM module:

```bash
asc ASBindTest.ts -o ASBindTest.wasm --exportRuntime --transform as-bind
```

Compiling our code with the `as-bind` transform simplifies what we must do from our JavaScript.
I will be using Node.js to run the JavaScript that calls into our WebAssembly module.
Create a file called `ASBindTest.js` and add the following code:

```javascript
// I'm using node for this example
const AsBind = require("as-bind/dist/as-bind.cjs.js");
const fs = require("fs");
const wasm = fs.readFileSync("./ASBindTest.wasm");

// asynchronous IIFE for async/await
(async () => {
  // use as-bind to instantiate WebAssembly
  const asBindInstance = await AsBind.instantiate(wasm);
  // destructure the classes created in ASBindTest.ts
  ({ Vector2D, Vector3D } = asBindInstance.exports);
  let vec2 = new Vector2D(3, 4); // create new Vector2D object
  let vec3 = new Vector3D(3, 4, 5); // create new Vector3D objecst

  console.log(`
  ----- 2D VECTOR -----
  x: ${vec2.x}
  y: ${vec2.y}
  Magnitude: ${vec2.Magnitude()}
  Magnitude Squared: ${vec2.MagSQ()}
  ----- 3D VECTOR -----
  x: ${vec3.x}
  y: ${vec3.y}
  z: ${vec3.z}
  w: ${vec3.w}
  Magnitude: ${vec3.Magnitude()}
  Magnitude Squared: ${vec3.MagSQ()}
  `);
})();
```

When using the `as-bind` module to instantiate a WebAssembly module, it places the
classes we exported from that module in the unboundExports object inside. In the code
above, I used the destructuring syntax to pull them into class constructor variables. You
can run `ASBindTest.js` using node with the following command:

```bash
node ASBindTest.js
```

When you run it, you should see the following output:

```plaintext
  ----- 2D VECTOR -----
  x: 3
  y: 4
  Magnitude: 5
  Magnitude Squared: 25
  ----- 3D VECTOR -----
  x: 3
  y: 4
  z: 5
  w: undefined
  Magnitude: 7.071067810058594
  Magnitude Squared: 50
```

Notice the line `w: undefined` in the console output. The w attribute is undefined
because we used the private keyword when we created that attribute in the Vector3D
class. If we remove the Magnitude function override from our Vector3D class in the
AssemblyScript and recompile, we would see both magnitude lines in our console reading
`Magnitude: 5` instead of the second one reading `Magnitude: 7.071067810058594`.
That is because AssemblyScript has not yet implemented a method for looking up function
overrides. The `Magnitude` function does not know that it should be calling the `MagSQ`
function for the `Vector3D` class and not the `Vector2D` class.

The entire source code to the demo can be found [here](/source-redirect?path=examples/classes/demo/assemblyscript).
