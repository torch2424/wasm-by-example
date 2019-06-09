(module
 (type $FUNCSIG$v (func))
 (type $FUNCSIG$iii (func (param i32 i32) (result i32)))
 (memory $0 0)
 (table $0 1 funcref)
 (elem (i32.const 0) $null)
 (global $~lib/memory/HEAP_BASE i32 (i32.const 8))
 (export "memory" (memory $0))
 (export "table" (table $0))
 (export "amplifyAudioInBuffer" (func $index/amplifyAudioInBuffer))
 (start $start)
 (func $start:index (; 0 ;) (type $FUNCSIG$v)
  i32.const 1
  grow_memory
  drop
 )
 (func $index/amplifyAudioInBuffer (; 1 ;) (type $FUNCSIG$iii) (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  local.get $0
  local.get $1
  i32.add
  local.set $2
  block $break|0
   i32.const 0
   local.set $3
   loop $repeat|0
    local.get $3
    local.get $1
    i32.lt_s
    i32.eqz
    br_if $break|0
    block
     local.get $0
     local.get $3
     i32.add
     i32.load8_u
     local.set $4
     local.get $4
     i32.const 127
     i32.gt_u
     if
      local.get $4
      i32.const 127
      i32.sub
      local.set $5
      local.get $4
      local.get $5
      i32.add
      local.set $4
     else      
      local.get $4
      i32.const 127
      i32.lt_u
      if
       local.get $4
       i32.const 2
       i32.div_u
       local.set $4
      end
     end
     local.get $2
     local.get $3
     i32.add
     local.get $4
     i32.store8
    end
    local.get $3
    i32.const 1
    i32.add
    local.set $3
    br $repeat|0
    unreachable
   end
   unreachable
  end
  local.get $2
 )
 (func $start (; 2 ;) (type $FUNCSIG$v)
  call $start:index
 )
 (func $null (; 3 ;) (type $FUNCSIG$v)
 )
)
