(module
 (type $FUNCSIG$v (func))
 (type $FUNCSIG$viiiiii (func (param i32 i32 i32 i32 i32 i32)))
 (memory $0 0)
 (table $0 1 funcref)
 (elem (i32.const 0) $null)
 (global $~lib/memory/HEAP_BASE i32 (i32.const 8))
 (export "memory" (memory $0))
 (export "table" (table $0))
 (export "generateCheckerBoard" (func $index/generateCheckerBoard))
 (start $start)
 (func $start:index (; 0 ;) (type $FUNCSIG$v)
  i32.const 1
  grow_memory
  drop
 )
 (func $index/generateCheckerBoard (; 1 ;) (type $FUNCSIG$viiiiii) (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (param $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $13 i32)
  block $break|0
   i32.const 0
   local.set $6
   loop $repeat|0
    local.get $6
    i32.const 20
    i32.lt_s
    i32.eqz
    br_if $break|0
    block $break|1
     i32.const 0
     local.set $7
     loop $repeat|1
      local.get $7
      i32.const 20
      i32.lt_s
      i32.eqz
      br_if $break|1
      block
       i32.const 1
       local.set $8
       local.get $7
       i32.const 2
       i32.rem_s
       i32.const 0
       i32.eq
       if
        i32.const 0
        local.set $8
       end
       local.get $6
       i32.const 2
       i32.rem_s
       i32.const 0
       i32.eq
       if
        local.get $8
        i32.eqz
        local.set $8
       end
       local.get $0
       local.set $9
       local.get $1
       local.set $10
       local.get $2
       local.set $11
       local.get $8
       i32.eqz
       if
        local.get $3
        local.set $9
        local.get $4
        local.set $10
        local.get $5
        local.set $11
       end
       local.get $7
       i32.const 20
       i32.mul
       local.get $6
       i32.add
       local.set $12
       local.get $12
       i32.const 4
       i32.mul
       local.set $13
       local.get $13
       i32.const 0
       i32.add
       local.get $9
       i32.store8
       local.get $13
       i32.const 1
       i32.add
       local.get $10
       i32.store8
       local.get $13
       i32.const 2
       i32.add
       local.get $11
       i32.store8
       local.get $13
       i32.const 3
       i32.add
       i32.const 255
       i32.store8
      end
      local.get $7
      i32.const 1
      i32.add
      local.set $7
      br $repeat|1
      unreachable
     end
     unreachable
    end
    local.get $6
    i32.const 1
    i32.add
    local.set $6
    br $repeat|0
    unreachable
   end
   unreachable
  end
 )
 (func $start (; 2 ;) (type $FUNCSIG$v)
  call $start:index
 )
 (func $null (; 3 ;) (type $FUNCSIG$v)
 )
)
