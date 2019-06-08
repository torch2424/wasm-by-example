(module
 (type $FUNCSIG$v (func))
 (type $FUNCSIG$i (func (result i32)))
 (memory $0 0)
 (table $0 1 funcref)
 (elem (i32.const 0) $null)
 (global $index/index i32 (i32.const 0))
 (global $index/value i32 (i32.const 24))
 (global $~lib/memory/HEAP_BASE i32 (i32.const 8))
 (export "memory" (memory $0))
 (export "table" (table $0))
 (export "readWasmMemoryAndReturnIndexOne" (func $index/readWasmMemoryAndReturnIndexOne))
 (start $start)
 (func $start:index (; 0 ;) (type $FUNCSIG$v)
  i32.const 1
  grow_memory
  drop
  global.get $index/index
  global.get $index/value
  i32.store8
 )
 (func $index/readWasmMemoryAndReturnIndexOne (; 1 ;) (type $FUNCSIG$i) (result i32)
  (local $0 i32)
  i32.const 1
  i32.load8_u
  local.set $0
  local.get $0
 )
 (func $start (; 2 ;) (type $FUNCSIG$v)
  call $start:index
 )
 (func $null (; 3 ;) (type $FUNCSIG$v)
 )
)
