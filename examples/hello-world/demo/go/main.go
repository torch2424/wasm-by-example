package main

func jsadd(x, y int) int

func main() {
   println("adding two numbers:", jsadd(2, 3))
}

//go:export add
func add(x int, y int) int {
    return x + y;
}
