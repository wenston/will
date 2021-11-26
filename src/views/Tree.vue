<template>
  <h1>{{currentRoute.meta.title}}</h1>
  <p></p>
  <div :id="css.info"
    ref="info"></div>
  <div :class="css.tree_box"
    :item-height="15">
    <Tree :data="bigDataList"
      :class="css.tree">
      <template #use="{current}">
        <Teleport v-if="info"
          :to="info">
          <div>
            <div>{{current.index}}；{{current.item?.Name}}</div>
          </div>
        </Teleport>
      </template>
    </Tree>

  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import Tree from '../packages/components/tree'
const { currentRoute } = useRouter()

import { onMounted, ref, Teleport } from 'vue'
import Btn from '../packages/components/btn'
import { plattenTreeNode } from '../packages/util'
import treeData from '../mock-data/3c'
const plat = plattenTreeNode(treeData, 'Childs')

const bigDataList = ref<any[]>([])
const info = ref(null)
// bigDataList.value = treeData
onMounted(() => {
  setTimeout(() => {
    bigDataList.value = treeData
  })
})
function onClick() {
  console.log('click')
}
</script>
<style module="css" lang="postcss">
.info {
  background-color: #ccc;
}
.tree_box {
  margin-top: 20px;
  padding: 15px 12px;
}
.tree {
  height: 80vh;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: var(--w-radius);
}
</style>
