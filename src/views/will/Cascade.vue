<template>
  <h1>级联选择</h1>

  <p>
    <Btn @click="toSet('block')">长短切换</Btn>
    <Btn @click="toSet('clearable')">可清空切换</Btn>
    <Btn @click="toSet('disabled')">启禁用</Btn>
  </p>
  <p>
    <Cascade v-bind="cascadeOptions" />
  </p>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import Cascade from 'will-ui/components/cascade/index'
import areaData from '../../mock-data/area'
import Btn from 'will-ui/components/btn/index'
const ps = reactive({
  block: false,
  disabled: false,
  clearable: false
})

const cascadeOptions = computed(() => {
  return {
    keyField: 'code',
    textField: 'name',
    childField: 'detail',
    data: areaData,
    placeholder: '请选择区域',
    ...ps
  }
})

function toSet(p: 'block' | 'disabled' | 'clearable') {
  ps[p] = !ps[p]
}
</script>

<style lang="postcss" module="css"></style>
