<template>
  <h1>{{currentRoute.meta.title}}</h1>
  <p>
    <Btn @click="toShowPopup">弹出</Btn>
  </p>
  <Popup v-model:show="show">
    <template #header>
      <div>标题</div>
    </template>
    <template #default>
      <p>弹出框里的内容</p>
    </template>
    <template #footer="{toggle}">
      <Btn @click="toggle">确定</Btn>
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
import Popup from '../packages/components/popup/index'
import Btn from '../packages/components/btn/index'
const { currentRoute } = useRouter()
const placement = ref('left')
const show = ref(false)
function toShowPopup() {
  show.value = true
}
</script>