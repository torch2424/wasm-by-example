index.wasm: main.c
	clang -target wasm32 -O3 -flto -nostdlib -Wl,--no-entry -Wl,--export-all -o index.wasm main.c
