package main

func jsPrintInt(x int)

// Declare a main function, this is the entrypoint into our go module
// That will be run. We could just call out log function from here, but
// going to export a function :)
func main() {}

// Export a function that takes in an integer
// and calls an imported function from the importObject
// to log out that integer, back inside of JavaScript
//export printIntFromWasm
func printIntFromWasm(x int) {
    jsPrintInt(x)
}
