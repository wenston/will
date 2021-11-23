<template>
  <h1>{{currentRoute.meta.title}}</h1>
  <Tree :data="bigDataList"
    :class="css.tree"></Tree>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import Tree from '../packages/components/tree'
const { currentRoute } = useRouter()

import { onMounted, ref, VNode } from 'vue'
import Btn from '../packages/components/btn'
import { plattenTreeNode } from '../packages/util'
import treeData from '../mock-data/3c'
const plat = plattenTreeNode(treeData, 'Childs')

const bigDataList = ref<any[]>([])
// bigDataList.value = treeData
onMounted(() => {
  setTimeout(() => {
    bigDataList.value = treeData
  }, 200)
})
</script>
<style module="css" lang="postcss">
.tree {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: var(--w-radius);
  height: 60vh;
}
</style>
