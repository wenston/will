<template>
  <h1>{{currentRoute.meta.title}}</h1>
  <p>
    <btn @click="toAdd">加点数据看看</btn>
  </p>
  <div :id="css.info"
    ref="info"></div>
  <div :class="css.tree_box"
    :item-height="15">
    <Tree :data="bigDataList"
      :class="css.tree"
      v-model:keys="keys">
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
  <div style="word-break:break-word">
    {{JSON.stringify(keys)}}
  </div>
  <!-- <p>
    <Btn type="primary">给树数据添加点东西测试一下</Btn>
  </p> -->
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import Tree from '../packages/components/tree'
const { currentRoute } = useRouter()

import { onMounted, ref, Teleport, watch } from 'vue'
import Btn from '../packages/components/btn/index'
import { plattenTreeData } from '../packages/util'
import treeData from '../mock-data/3c'
const { filterPlattenData: plat } = plattenTreeData(treeData, 'Childs')

const bigDataList = ref<any[]>([])
const keys = ref([])
const info = ref(null)
onMounted(() => {
  setTimeout(() => {
    bigDataList.value = treeData
  })
})
function toAdd() {
  bigDataList.value.push({
    Id: Math.random() * 20000,
    Name: '新增的数据',
    Levels: 1,
    Childs: [
      {
        Id: 33333,
        Name: '新增数据的下级',
        Levels: 2
      }
    ]
  })
}
</script>
<style module="css" lang="postcss">
.info {
  background-color: #ccc;
}
.tree_box {
  margin-top: 10px;
  padding: 15px 12px;
}
.tree {
  height: 60vh;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: var(--w-radius);
}
</style>
