(module
 (type $FUNCSIG$iii (func (param i32 i32) (result i32)))
 (type $FUNCSIG$v (func))
 (memory $0 0)
 (table $0 1 funcref)
 (elem (i32.const 0) $null)
 (global $exports/GET_THIS_CONSTANT_FROM_JAVASCRIPT i32 (i32.const 2424))
 (global $exports/ADD_CONSTANT i32 (i32.const 1))
 (global $~lib/memory/HEAP_BASE i32 (i32.const 8))
 (export "memory" (memory $0))
 (export "table" (table $0))
 (export "callMeFromJavascript" (func $exports/callMeFromJavascript))
 (export "GET_THIS_CONSTANT_FROM_JAVASCRIPT" (global $exports/GET_THIS_CONSTANT_FROM_JAVASCRIPT))
 (export "addIntegerWithConstant" (func $exports/addIntegerWithConstant))
 (func $exports/addIntegerWithConstant (; 0 ;) (type $FUNCSIG$iii) (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  local.get $1
  i32.add
  global.get $exports/ADD_CONSTANT
  i32.add
 )
 (func $exports/callMeFromJavascript (; 1 ;) (type $FUNCSIG$iii) (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  local.get $1
  call $exports/addIntegerWithConstant
 )
 (func $null (; 2 ;) (type $FUNCSIG$v)
 )
)
