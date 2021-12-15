<template>
  <h1>{{currentRoute.meta.title}}</h1>
  <p>
    <Btn @click="toShowPopup">弹出</Btn>
  </p>
  <Popup v-model:show="show"
    title="弹框的标题"
    @after-ok="afterOk">
    <Tooltip placement="left">
      <template #trigger>
        <span>备注</span>
      </template>
      备注一些东西看看
    </Tooltip>
    <template v-for="n in 10"
      :key="n">
      <p>这是里边的内容</p>
      <p>内容随意定义</p>
    </template>
    <template #trigger="{toggle}">
      <Btn @click="toggle">从组件内部也可以触发弹窗出现，这种方式可以节约变量的定义数量</Btn>
    </template>
  </Popup>
  <!-- <p>
    <Btn @click="beforeShow('left')">左侧</Btn>
    <Btn @click="beforeShow('right')">右侧</Btn>
    <Btn @click="beforeShow('top')">上侧</Btn>
    <Btn @click="beforeShow('bottom')">下侧</Btn>
  </p> -->
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Popup from 'will-ui/components/popup/index'
import Btn from 'will-ui/components/btn/index'
import Tooltip from 'will-ui/components/tooltip/index'
const { currentRoute } = useRouter()
const placement = ref('left')
const show = ref(false)
function toShowPopup() {
  show.value = true
}
function afterOk(hide: () => void) {
  const n = Math.random()
  // if (n > 0.5) {
  hide()
  // }
}
</script>