<template>
  <h3>按钮</h3>
  <p>x:{{ client.x }},y:{{ client.y }}</p>
  <div>
    <Btn type="primary" @click="handleClick">按钮哈</Btn>
    <Btn type="primary" capsule @click="handleClick">按钮哈</Btn>
    <Btn type="primary" capsule mode="text">按钮哈</Btn>
    <Btn type="primary" capsule mode="line">按钮哈</Btn>
    <Btn type="default">默认的按钮</Btn>
    <Btn mode="text">text</Btn>
    <Btn mode="line">带边框的</Btn>
    <Btn type="primary" mode="line">带边框的</Btn>
    <Btn type="primary" mode="text">带边框的</Btn>
  </div>
  <div>
    <Btn disabled type="primary" @click="handleClick">primary</Btn>
    <Btn type="default" disabled>默认的按钮</Btn>
  </div>
  <div>
    <Btn block>一整行，其实是flex布局</Btn>
  </div>
</template>
<script setup lang="ts">
import Btn from 'will-ui/components/btn/index'
import useMouse from 'will-ui/use/useMouse'
const { client } = useMouse()
function handleClick(e: MouseEvent) {
  console.log('hhhhhh')
}
</script>
