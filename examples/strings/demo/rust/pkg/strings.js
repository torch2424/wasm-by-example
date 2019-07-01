const __exports = {};
let wasm;

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder("utf-8");

let cachegetUint8Memory = null;
function getUint8Memory() {
  if (
    cachegetUint8Memory === null ||
    cachegetUint8Memory.buffer !== wasm.memory.buffer
  ) {
    cachegetUint8Memory = new Uint8Array(wasm.memory.buffer);
  }
  return cachegetUint8Memory;
}

let passStringToWasm;
if (typeof cachedTextEncoder.encodeInto === "function") {
  passStringToWasm = function(arg) {
    let size = arg.length;
    let ptr = wasm.__wbindgen_malloc(size);
    let offset = 0;
    {
      const mem = getUint8Memory();
      for (; offset < arg.length; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7f) break;
        mem[ptr + offset] = code;
      }
    }

    if (offset !== arg.length) {
      arg = arg.slice(offset);
      ptr = wasm.__wbindgen_realloc(
        ptr,
        size,
        (size = offset + arg.length * 3)
      );
      const view = getUint8Memory().subarray(ptr + offset, ptr + size);
      const ret = cachedTextEncoder.encodeInto(arg, view);

      offset += ret.written;
    }
    WASM_VECTOR_LEN = offset;
    return ptr;
  };
} else {
  passStringToWasm = function(arg) {
    let size = arg.length;
    let ptr = wasm.__wbindgen_malloc(size);
    let offset = 0;
    {
      const mem = getUint8Memory();
      for (; offset < arg.length; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7f) break;
        mem[ptr + offset] = code;
      }
    }

    if (offset !== arg.length) {
      const buf = cachedTextEncoder.encode(arg.slice(offset));
      ptr = wasm.__wbindgen_realloc(ptr, size, (size = offset + buf.length));
      getUint8Memory().set(buf, ptr + offset);
      offset += buf.length;
    }
    WASM_VECTOR_LEN = offset;
    return ptr;
  };
}

let cachedTextDecoder = new TextDecoder("utf-8");

function getStringFromWasm(ptr, len) {
  return cachedTextDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
}

let cachedGlobalArgumentPtr = null;
function globalArgumentPtr() {
  if (cachedGlobalArgumentPtr === null) {
    cachedGlobalArgumentPtr = wasm.__wbindgen_global_argument_ptr();
  }
  return cachedGlobalArgumentPtr;
}

let cachegetUint32Memory = null;
function getUint32Memory() {
  if (
    cachegetUint32Memory === null ||
    cachegetUint32Memory.buffer !== wasm.memory.buffer
  ) {
    cachegetUint32Memory = new Uint32Array(wasm.memory.buffer);
  }
  return cachegetUint32Memory;
}
/**
 * @param {string} input_string
 * @returns {string}
 */
export function add_wasm_by_example_to_string(input_string) {
  const ptr0 = passStringToWasm(input_string);
  const len0 = WASM_VECTOR_LEN;
  const retptr = globalArgumentPtr();
  wasm.add_wasm_by_example_to_string(retptr, ptr0, len0);
  const mem = getUint32Memory();
  const rustptr = mem[retptr / 4];
  const rustlen = mem[retptr / 4 + 1];

  const realRet = getStringFromWasm(rustptr, rustlen).slice();
  wasm.__wbindgen_free(rustptr, rustlen * 1);
  return realRet;
}
__exports.add_wasm_by_example_to_string = add_wasm_by_example_to_string;

/**
 * @returns {string}
 */
export function test() {
  const retptr = globalArgumentPtr();
  wasm.test(retptr);
  const mem = getUint32Memory();
  const rustptr = mem[retptr / 4];
  const rustlen = mem[retptr / 4 + 1];

  const realRet = getStringFromWasm(rustptr, rustlen).slice();
  wasm.__wbindgen_free(rustptr, rustlen * 1);
  return realRet;
}
__exports.test = test;

function init(module) {
  let result;
  const imports = { "./strings": __exports };

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
