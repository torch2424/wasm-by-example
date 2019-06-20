const __exports = {};
let wasm;

/**
 * @returns {number}
 */
export function get_output_buffer_pointer() {
  return wasm.get_output_buffer_pointer();
}
__exports.get_output_buffer_pointer = get_output_buffer_pointer;

/**
 * @param {number} dark_value_red
 * @param {number} dark_value_green
 * @param {number} dark_value_blue
 * @param {number} light_value_red
 * @param {number} light_value_green
 * @param {number} light_value_blue
 * @returns {void}
 */
export function generate_checker_board(
  dark_value_red,
  dark_value_green,
  dark_value_blue,
  light_value_red,
  light_value_green,
  light_value_blue
) {
  return wasm.generate_checker_board(
    dark_value_red,
    dark_value_green,
    dark_value_blue,
    light_value_red,
    light_value_green,
    light_value_blue
  );
}
__exports.generate_checker_board = generate_checker_board;

function init(module) {
  let result;
  const imports = { "./graphics": __exports };

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
