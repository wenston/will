<template>
  <h1>{{ currentRoute.meta.title }}</h1>
  <p>
    <Btn @click="toUnshift()">上边添加一项</Btn>
    <Btn @click="toAdd()">下边添加一项</Btn>
    <!-- <Btn @click="toDel">删除一项</Btn> -->
  </p>
  <div :class="[dir === 'up' ? 'wrapper' : 'wrapper-bottom']">
    <transition-group name="list" @after-enter="afterEnter">
      <div class="list-item" v-for="(el, i) in listData" :key="el">
        <div class="item-box">
          <p>这里是内容哦，这里是第&#12288;{{ i }}&#12288;项</p>
          <p>一些测试用的内容</p>
        </div>
      </div>
    </transition-group>
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import Btn from '../../../packages/components/btn/index'
import useCount from '../../../packages/use/useCount'
const { currentRoute } = useRouter()
const dir = ref('up')
const listData = ref([1])
const { count, add } = useCount({ init: 2, step: 1 })
function getRandom() {
  return Math.floor(Math.random() * listData.value.length)
}
function toAdd() {
  dir.value = 'bottom'
  listData.value.push(add())
}
function toUnshift() {
  dir.value = 'up'
  listData.value.unshift(add())
}
function afterEnter() {
  if (dir.value === 'bottom') listData.value.shift()
  else {
    listData.value.pop()
  }
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
  transition: all 0.3s ease-out;
}
.list-enter-from {
  transform: translate(-100%, 0);
}
.list-leave-to {
  transform: scale(0, 0);
}
.list-move {
  transition: transform 0.3s ease-out;
}
.wrapper {
  display: flex;
  width: 250px;
  flex-direction: row;
  justify-content: flex-start;
  height: 74px;
  overflow: hidden;
  outline: 5px solid chocolate;
}
.list-item {
  flex: 0 0 100%;
  padding: 1px;
  border-radius: var(--w-radius);
  background-image: linear-gradient(-45deg, #ccc, var(--w-color-primary));
}
.item-box {
  padding: var(--w-gap);
  background-color: white;
  border-radius: var(--w-radius);
}

.wrapper-bottom {
  display: flex;
  width: 250px;
  flex-direction: row;
  justify-content: flex-end;
  height: 74px;
  overflow: hidden;
  outline: 5px solid chocolate;
  & .list-enter-from {
    transform: translate(100%, 0);
  }
}
</style>
