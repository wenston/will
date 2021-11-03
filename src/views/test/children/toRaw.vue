<template>
  <div class="quote">
    <p>
      返回 reactive 或 readonly 代理的原始对象。这是一个<q>逃生舱</q>，可用于临时读取数据而无需承担代理访问/跟踪的开销，也可用于写入数据而避免触发更改。不建议保留对原始对象的持久引用。请谨慎使用。
    </p>
  </div>
  <div class="example">
    <p>
      <Btn mode="line"
        @click="toChangeName">改变reactive代理的obj的name</Btn>
      <Btn mode="line"
        @click="toRead">改变toRaw包装过的obj的name</Btn>
      <Btn mode="line"
        @click="toChangeObj">如果改变obj原始值呢</Btn>
    </p>
    <p>
      响应name:{{r_obj.name}}
    </p>
    <p>
      {{raw_obj.name}}
    </p>
    <p>
      <Btn @click="toLook">点我查看最终的name</Btn>

    </p>
    <p></p>
  </div>
  <div class="sumup">
    <p>
      就像直接改变一个没有经过 reactive 代理的对象一样，改变之后不会引起视图更新
    </p>
    <p>
      暂时没有想到合适的用处？！
    </p>

  </div>

</template>
<script lang="ts" setup>
import Btn from '../../../packages/components/btn/index'

import { reactive, toRaw } from 'vue'
const obj = { name: 'will', age: 20 }
const r_obj = reactive(obj)
const raw_obj = toRaw(r_obj)
console.log(raw_obj === obj) //true，由此可见，raw_obj就是obj！
function toChangeName() {
  r_obj.name = '我是通过reactive改变了name，引发了视图更新'
}
function toRead() {
  raw_obj.name = '通过toRaw代理改变了name，真的没有视图的更新！'
  console.log(r_obj.name)
}
function toChangeObj() {
  obj.name = '直接改变obj的name'
}
function toLook() {
  console.log('obj.name:', obj.name)
  console.log('r_obj.name', r_obj.name)
  console.log('raw_obj.name', raw_obj.name)
}
</script>