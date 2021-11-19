<template>
  <h1>{{currentRoute.meta.title}}</h1>
  <p>数据条数：{{bigDataList.length}}，火狐下，容器高度太高，会导致【溢出】！</p>
  <Virtual :class="css.virtualbox"
    :sourceData="bigDataList"
    :item-height="43">
    <template #default="{data}">
      <div :class="css.btn"
        v-for="item in data"
        :key="item">
        <Btn block>{{item}}{{item==bigDataList.length-1?'列表数据已到底了！到底了！':'下边还有数据哦！'}}</Btn>
      </div>
    </template>
  </Virtual>

</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
const { currentRoute } = useRouter()

import { onMounted, ref, VNode } from 'vue'
import Virtual from '../packages/components/virtual'
import Btn from '../packages/components/btn'

const bigDataList = ref<any[]>([])

onMounted(() => {
  setTimeout(() => {
    const arr = new Array(300000)
    bigDataList.value = Array.from(arr, (v, i) => {
      return i
    })
    console.log(bigDataList.value.length)
  }, 10)
})

function btnMouted(comp: VNode) {
  console.log(comp.el)
}
</script>
<style module="css" lang="postcss">
.virtualbox {
  border: 1px solid var(--w-color-border);
  border-radius: var(--w-radius);
}
.btn {
  height: 43px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background-color: #ccc;
}
</style>
