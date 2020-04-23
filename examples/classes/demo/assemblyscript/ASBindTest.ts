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
