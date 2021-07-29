#!/bin/bash

# Compile the TinyGo Wasm Module that targets WASI
# Note, some features aren't fully supported by WASI. So if you hit nil pointer references
# You may want to play around with the scheduler and gc flags. For example:
# "-scheduler=none -gc=conservative" or "-scheduler=coroutines -gc=leaking"
tinygo build -wasm-abi=generic -target=wasi -o main.wasm main.go

# Run the Wasm module with wasmtime, 
# while passing in the capability to modify the filesytem of the current directory
wasmtime --dir . main.wasm
