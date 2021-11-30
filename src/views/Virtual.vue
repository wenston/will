<template>
  <h1>{{currentRoute.meta.title}}</h1>
  <p>数据条数：{{bigDataList.length}}，火狐下，容器高度太高，会导致【溢出】！</p>
  <Virtual :class="css.virtualbox"
    :sourceData="bigDataList"
    :item-height="30">
    <template #default="{data,index:{from},scrollTo}">
      <template v-for="(item,i) in data"
        :key="item.Id">
        <div :class="css.btn"
          @click="scrollTo(0,(from+i)*30)">
          <span v-if="item.Levels>1">
            <template v-for="n in item.Levels - 1"
              :key="n">
              &#12288;
            </template>
          </span>

          <span>{{item.Name}}</span>
        </div>
      </template>

    </template>
  </Virtual>

</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
const { currentRoute } = useRouter()

import { onMounted, ref, VNode } from 'vue'
import Virtual from '../packages/components/virtual'
import Btn from '../packages/components/btn'
import { plattenTreeData } from '../packages/util'
import treeData from '../mock-data/3c'
const { filterPlattenData: plat } = plattenTreeData(treeData, 'Childs')

const bigDataList = ref<any[]>([])

onMounted(() => {
  setTimeout(() => {
    bigDataList.value = plat
  }, 10)
})

function hasChild(from: number, i: number): boolean {
  const nextItem = bigDataList.value[from + i + 1]
  return nextItem && nextItem.Levels - 1 === bigDataList.value[from + i].Levels
}
function toShow(item: any, i: number) {
  bigDataList.value.splice(i + 1, 0, ...item.Childs)
}
</script>
<style module="css" lang="postcss">
.virtualbox {
  border: 1px solid var(--w-color-border);
  border-radius: var(--w-radius);
  height: 60vh;
}
.btn {
  height: 30px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background-color: #fefefe;
}
</style>
