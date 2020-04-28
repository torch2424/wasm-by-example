package main

func main() {}

// This exports an add function.
// It takes in two 32-bit integer values
// And returns a 32-bit integer value.
// To make this function callable from JavaScript, 
// we need to add the: "go:export add" comment above the function
//go:export callMeFromJavascript
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

