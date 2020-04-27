package main

func main() {}

//go:export add
func add(x int, y int) int {
    return x + y;
}
