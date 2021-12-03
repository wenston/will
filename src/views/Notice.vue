<template>
  <h1>{{currentRoute.meta.title}}</h1>
  <p>
    <Btn @click="toShowNotice">展示一个通知</Btn>
  </p>
  <Notice v-model:show="showNotice"></Notice>

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
import Notice from '../packages/components/notice/index'
import Btn from '../packages/components/btn/index'
const { currentRoute } = useRouter()
const showNotice = ref(false)
function toShowNotice() {
  showNotice.value = true
}
</script>