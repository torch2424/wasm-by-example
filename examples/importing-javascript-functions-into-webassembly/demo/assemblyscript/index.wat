(module
 (type $FUNCSIG$vi (func (param i32)))
 (type $FUNCSIG$v (func))
 (import "index" "consoleLog" (func $index/consoleLog (param i32)))
 (memory $0 0)
 (table $0 1 funcref)
 (elem (i32.const 0) $null)
 (global $~lib/memory/HEAP_BASE i32 (i32.const 8))
 (export "memory" (memory $0))
 (export "table" (table $0))
 (start $start)
 (func $start:index (; 1 ;) (type $FUNCSIG$v)
  i32.const 24
  call $index/consoleLog
 )
 (func $start (; 2 ;) (type $FUNCSIG$v)
  call $start:index
 )
 (func $null (; 3 ;) (type $FUNCSIG$v)
 )
)
