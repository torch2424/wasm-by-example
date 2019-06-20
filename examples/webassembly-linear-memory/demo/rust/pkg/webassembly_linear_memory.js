const __exports = {};
let wasm;

/**
 * @param {number} value
 * @returns {void}
 */
export function store_value_in_wasm_memory_buffer_index_zero(value) {
  return wasm.store_value_in_wasm_memory_buffer_index_zero(value);
}
__exports.store_value_in_wasm_memory_buffer_index_zero = store_value_in_wasm_memory_buffer_index_zero;

/**
 * @returns {number}
 */
export function get_wasm_memory_buffer_pointer() {
  return wasm.get_wasm_memory_buffer_pointer();
}
__exports.get_wasm_memory_buffer_pointer = get_wasm_memory_buffer_pointer;

/**
 * @returns {number}
 */
export function read_wasm_memory_buffer_and_return_index_one() {
  return wasm.read_wasm_memory_buffer_and_return_index_one();
}
__exports.read_wasm_memory_buffer_and_return_index_one = read_wasm_memory_buffer_and_return_index_one;

function init(module) {
  let result;
  const imports = { "./webassembly_linear_memory": __exports };

  if (
    module instanceof URL ||
    typeof module === "string" ||
    module instanceof Request
  ) {
    const response = fetch(module);
    if (typeof WebAssembly.instantiateStreaming === "function") {
      result = WebAssembly.instantiateStreaming(response, imports).catch(e => {
        console.warn(
          "`WebAssembly.instantiateStreaming` failed. Assuming this is because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",
          e
        );
        return response
          .then(r => r.arrayBuffer())
          .then(bytes => WebAssembly.instantiate(bytes, imports));
      });
    } else {
      result = response
        .then(r => r.arrayBuffer())
        .then(bytes => WebAssembly.instantiate(bytes, imports));
    }
  } else {
    result = WebAssembly.instantiate(module, imports).then(result => {
      if (result instanceof WebAssembly.Instance) {
        return { instance: result, module };
      } else {
        return result;
      }
    });
  }
  return result.then(({ instance, module }) => {
    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;

    return wasm;
  });
}

export default init;
