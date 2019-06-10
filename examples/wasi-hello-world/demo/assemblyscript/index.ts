// This example depends on the AssemblyScript Runtime:
// https://docs.assemblyscript.org/details/runtime

// Import from the AssemblyScript Wasi bindings
import { fd_write } from "bindings/wasi";

function writeToStdOut(fileDescriptor: fd, value: string): void {
  let s_utf8_len: usize = value.lengthUTF8 - 1;
  let s_utf8 = value.toUTF8();
  let iov = memory.allocate(4 * sizeof<usize>());
  store<u32>(iov, s_utf8);
  store<u32>(iov + sizeof<usize>(), s_utf8_len);
  let lf = memory.allocate(1);
  store<u8>(lf, 10);
  store<u32>(iov + sizeof<usize>() * 2, lf);
  store<u32>(iov + sizeof<usize>() * 3, 1);
  let written_ptr = memory.allocate(sizeof<usize>());
  fd_write(fileDescriptor, iov, 2, written_ptr);
  memory.free(written_ptr);
  memory.free(s_utf8);
}

function consoleLog(value: string): void {
  writeToStdOut(value);
}

consoleLog("Hello Wasi!");
