package main

var addConstant int = 24;

func main() {}

//go:export callMeFromJavascript
func add(x int, y int) int {
    return x + y;
}


