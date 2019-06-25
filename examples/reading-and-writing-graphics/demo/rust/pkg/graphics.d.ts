/* tslint:disable */
/**
 * @returns {number}
 */
export function get_output_buffer_pointer(): number;
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
  dark_value_red: number,
  dark_value_green: number,
  dark_value_blue: number,
  light_value_red: number,
  light_value_green: number,
  light_value_blue: number
): void;

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
