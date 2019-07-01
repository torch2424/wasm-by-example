/* tslint:disable */
/**
 * @param {string} input_string
 * @returns {string}
 */
export function add_wasm_by_example_to_string(input_string: string): string;
/**
 * @returns {string}
 */
export function test(): string;

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
