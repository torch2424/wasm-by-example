# passing-array-from-javascript-to-cpp
In the following article we are going to learn how to pass array from javascript to C++ code compiled to wasm using emscripten

These are the following sections of the article
1. C++ Code
2. Compiling the code
3. Adding the script and Initializing the Module
4. Calling the C++ function
5. Showing the output


## 1. C++ Code
```cpp

#include<iostream>
#include<emscripten.h>
extern "C"{

    EMSCRIPTEN_KEEPALIVE
    void multiply(uint8_t * arr, int num,int length){

        for(int i = 0 ;i < length ;i++){
            *(arr + i) = *(arr + i) * num;
        }


    }

}

```

In the above code we used the `iostream` and `emscripten.h` header files as former is need for `uint8_t` type and latter is needed for `EMSCRIPTEN_KEEPALIVE`. In the function body we are assigning new value to each element of the array.

## 2. Compiling code 
```console
em++ function.cpp -o function.js -sEXPORTED_FUNCTIONS=['_malloc','_free'] -sEXPORTED_RUNTIME_METHODS=['ccall'] -sMODULARIZE
```
What this command does is that it uses our c++ file to produce the output file function.js. Using `-sEXPORTED_FUNCTIONS` we are telling the compiler to include `_malloc` and `_free` methods on the output and using `-sEXPORTED_RUNTIME_METHODS` we are telling the compiler to include `ccall` function to the output which is used to call the c++ function from javascript
