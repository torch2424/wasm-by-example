package main

// Import "fmt" from the Go Standard library to write to standard out
// Import "io/ioutil" from the Go Standard library to write to the filesystem
import (
	"fmt"
	"io/ioutil"
)

func main() {
	// Print out hello world!
	// This will handle writing to stdout for us using the WASI APIs (e.g fd_write)
	fmt.Println("Hello world!")

	// Get our hello world string as bytes, so we can write the string using ioutil
	helloWorldAsBytes := []byte("Hello world!\n")

	// We are writing a `helloworld.txt` file
	// This code requires the Wasi host to provide a directory on the guest.
	// For example, in Wasmtime, if you want to access to the current directory,
	// invoke the wasmtime with the flag/argument: `--dir .`
	err := ioutil.WriteFile("./helloworld.txt", helloWorldAsBytes, 0644)

	// If err is not nil, that means we could not create/write the file
	// (Probably because we did not add the `--dir` flag on our wasmtime command)
	if err != nil {
		panic(err)
	}
}
