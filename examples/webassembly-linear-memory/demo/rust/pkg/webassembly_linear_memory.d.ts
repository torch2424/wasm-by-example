/* tslint:disable */
/**
 * @param {number} value
 * @returns {void}
 */
export function store_value_in_wasm_memory_buffer_index_zero(
  value: number
): void;
/**
 * @returns {number}
 */
export function get_wasm_memory_buffer_pointer(): number;
/**
 * @returns {number}
 */
export function read_wasm_memory_buffer_and_return_index_one(): number;

/**
 * If `module_or_path` is {RequestInfo}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {RequestInfo | BufferSource | WebAssembly.Module} module_or_path
 *
 * @returns {Promise<any>}
 */
export default function init(
  module_or_path: RequestInfo | BufferSource | WebAssembly.Module
): Promise<any>;
