package main

var buffer [10]uint8;

func jsadd(x, y int) int

func main() {
   println("adding two numbers:", jsadd(2, 3))
}

//go:export add
func add(x int, y int) int {
    return x + y;
}

//go:export getWasmMemoryBufferPointer
func getWasmMemoryBufferPointer() *[10]uint8 {
  bufferPointer := &buffer;
  (*bufferPointer)[0] = 12;
  (*bufferPointer)[1] = 12;
  println("buffer 0:", buffer[0]);
  println("buffer 1:", buffer[1]);
  return bufferPointer;
}

//go:export logBuffer
func logBuffer() {
  println("buffer pointer:", &buffer);

  bufferPointer := &buffer;
  println("buffer 0:", (*bufferPointer)[0]);
  println("buffer 1:", buffer[1]);
  println("buffer 2:", buffer[2]);
  println("buffer 3:", buffer[3]);
}
