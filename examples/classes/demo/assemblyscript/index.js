// I'm using node for this example
const { AsBind } = require("as-bind");
const fs = require("fs");
const wasm = fs.readFileSync("./ASBindTest.wasm");
// asynchronous IIFE for async/await
(async () => {
  // use as-bind to instantiate WebAssembly
  const asBindInstance = await AsBind.instantiate(wasm);
  // destructure the classes created in ASBindTest.ts
  ({ Vector2D, Vector3D } = asBindInstance.unboundExports);
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
