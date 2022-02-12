<template>
  <h1>{{ currentRoute.meta.title }}</h1>
  <p>
    <Btn @click="toAdd">添加一项</Btn>
    <Btn @click="toDel">删除一项</Btn>
  </p>
  <transition-group name="list">
    <div class="list-item" v-for="(el, i) in listData" :key="el">
      <div class="item-box">
        <p>这里是内容哦，这里是第&#12288;{{ i }}&#12288;项</p>
        <p>一些测试用的内容</p>
      </div>
    </div>
  </transition-group>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import Btn from '../../../packages/components/btn/index'
import useCount from '../../../packages/use/useCount'
const { currentRoute } = useRouter()
const listData = ref([1])
const { count, add } = useCount({ init: 2, step: 1 })
function getRandom() {
  return Math.floor(Math.random() * listData.value.length)
}
function toAdd() {
  listData.value.push(add())
}
function toDel() {
  const i = getRandom()
  console.log(i)
  listData.value.splice(i, 1)
}
</script>
<style lang="postcss">
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease-out;
}
.list-leave-active {
  position: absolute;
  transition: all 0.3s ease-out;
}
.list-enter-from {
  opacity: 0;
  transform: rotate(90deg);
}
.list-leave-to {
  opacity: 0;
  transform: scale(0, 0);
}
.list-move {
  transition: transform 0.3s ease-out;
}

.list-item {
  display: inline-flex;
  padding: 1px;
  border-radius: var(--w-radius);
  background-image: linear-gradient(-45deg, #ccc, var(--w-color-primary));
  margin: 10px;
}
.item-box {
  padding: var(--w-gap);
  background-color: white;
  border-radius: var(--w-radius);
}
</style>
