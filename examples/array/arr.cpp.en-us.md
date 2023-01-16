# passing-array-from-javascript-to-cpp
In the following article we are going to learn how to pass array from javascript to C++ code compiled to wasm using emscripten

These are the following sections of the article
1. C++ Code
2. Compiling the code
3. Adding the script and Initializing the Module
4. Calling the C++ function
5. Showing the output


## 1. C++ Code
cpp`
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
`
