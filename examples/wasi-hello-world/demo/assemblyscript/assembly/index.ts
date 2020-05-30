// As of AssemblyScript 0.10.0, adding `import "wasi"`, will automatically
// import WASI bindings, and add some nice defaults for compiling to WASI.
import "wasi";

// Import Console (for writing to stdout), and FileSystem (for reading/writing files)
// from "as-wasi". An API for working with WASI in AssemblyScript much easier.
import { Console, FileSystem, Descriptor } from "as-wasi";

// Print out hello world!
// This will handle writing to stdout for us using the WASI APIs (e.g fd_write)
Console.log("Hello World!");

// We are creating/opening a `helloworld.txt` file
// This code requires the Wasi host to provide a directory on the guest.
// For example, in Wasmtime, if you want to access to the current directory,
// invoke the wasmtime with the flag/argument: `--dir .`
// FileSystem.open will return null if it fails to create/open the file
let filePath: string = "helloworld.txt";
let fileOrNull: Descriptor | null = FileSystem.open(filePath, "w+");

// Check if the FileSystem.open() returned null.
// This null check is done by:
// casting the Descriptor | null type to a pointer (usize)
// and checking if the pointer is zero.
// If fileOrNull is null, that means we could not create/open the file
// (Probably because we did not add the `--dir` flag)
// Throw an error.
if (changetype<usize>(fileOrNull) == 0) {
  throw new Error("Could not open the file " + filePath);
}

// Change our type from Descriptor | null, to Descriptor, as we checked above.
// Meaning, we were able to successfully open/create the file
let file = changetype<Descriptor>(fileOrNull);

// Write "Hello World!" to the file.
file.writeStringLn("Hello World!");
