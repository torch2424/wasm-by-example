// This exports an add function.
// It takes in two 32-bit integer values
// And returns a 32-bit integer value.
export function callMeFromJavascript(a: i32, b: i32): i32 {
  return addIntegerWithConstant(a, b);
}

// This exports a 32-bit integer constant
export const GET_THIS_CONSTANT_FROM_JAVASCRIPT: i32 = 2424;

// A NOT exported function
// It takes in two 32-bit integer values
// And returns a 32-bit integer value.
function addIntegerWithConstant(a: i32, b: i32): i32 {
  return a + b + ADD_CONSTANT;
}

// A NOT export constant
// a 32-bit integer constants
const ADD_CONSTANT: i32 = 1;
