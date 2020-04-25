// Import rust's io and filesystem module 
use std::io::prelude::*;
use std::fs;

// Entry point to our WASI applications
fn main() {
    // Print out hello world!
    // This will handle writing to /dev/stdout for us using the WASI APIs (e.g fd_write)
    println!("Hello world!");

    // Create a file
    // We are creating a `helloworld.txt` file in the `/helloworld` directory
    // We will use the wasmtime `--mapdir` flag. 
    // This will map the `/helloworld` directory on the guest, to  the current directory (`.`) on the host
    // For example: `--mapdir /helloworld::.`,
    // This will error if you don't use the `--mapdir` flag correctly.
    let mut file = fs::File::create("/helloworld/helloworld.txt").unwrap();

    // Write the text to the file we created
    write!(file, "Hello world!\n").unwrap();
}
