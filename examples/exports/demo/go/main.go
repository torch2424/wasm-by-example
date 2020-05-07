package main

// Declare a main function, this is the entrypoint into our go module
// That will be run. In our example, we won't need this
func main() {}

// This exports an add function.
// It takes in two 32-bit integer values
// And returns a 32-bit integer value.
// To make this function callable from JavaScript, 
// we need to add the: "export myFunctionName" comment above the function
//export callMeFromJavascript
func callMeFromJavascript(x int, y int) int {
    return addIntegerWithConstant(x, y);
}

// A NOT exported constant
// Go does not support exporting constants
// for Wasm (that I know of).
var ADD_CONSTANT int = 24;

// A NOT exported function
// It takes in two 32-bit integer values
// And returns a 32-bit integer value.
func addIntegerWithConstant(x int, y int) int {
  return x + y + ADD_CONSTANT;
}

