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
What this command does is that it uses our c++ file to produce the output file function.js. Using `-sEXPORTED_FUNCTIONS` we are telling the compiler to include `_malloc` and `_free` methods on the output and using `-sEXPORTED_RUNTIME_METHODS` we are telling the compiler to include `ccall` function to the output which is used to call the c++ function from javascript.

## 3. Adding script and intializing the module
After the code is compiled you can see 2 output files - function.wasm and function.js. Now create a html file and add the function.js file to the markup and then create a new script file inside which write the following code

```js

Module().then(mod => {
   let arr = [1,2,3,4,5,6,7,8,9];
   let num = 10;
   let typed_array = new Int8Array(arr);
   let pointer = mod._malloc(typed_array.length * typed_array.BYTES_PER_ELEMENT);
   mod.HEAP8.set(arr,pointer);
   mod.ccall("multiply",null,['number','number','number'],[pointer,num,typed_array.length]);
   let new_array = mod.HEAP8.subarray(pointer,pointer + (typed_array.length * typed_array.BYTES_PER_ELEMENT));
   console.log(new_array);
})
```

In above code we are initializing the Module which is inside the function.js file and after initialization we are using the output to our tasks. The following steps has been used to send array to c++ code

1. We allocated the memory to in the buffer using `_malloc` method, which takes a single argument which is the length.
2. Then we assigned we converted our array to a typed array(Int8Array) as in c++ we have different data types for different ranges of integer and our number can fit inside 8bit array.
3. we assigned this array to HEAP8 memory as it is designed to store 8 bit array, using the set method which takes 2 parameter array and the address from where we want to assign that array.
4. we called our function using the `ccall` method which takes 4 parameters - function name, return type, arguments type in array and then arguments in array.
