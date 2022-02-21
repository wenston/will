<template>
  <h1>多选Choose2</h1>
  <p style="margin-top: 20px">
    <Btn @click="disabled = !disabled" capsule mode="line">
      测试多选组件的启禁用
    </Btn>
  </p>
  <p>
    <Choose2
      :disabled="disabled"
      clearable
      v-model="supplierIds"
      placeholder="请选择供应商"
      text-placeholder="供应商"
      :data="supplierData"
      :checkable="checkable"
      @clear="onClear"
    >
      <template #default="{ item, index }">
        {{ item.Name }}
      </template>
    </Choose2>
  </p>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import Choose2 from 'will-ui/components/choose2/index'
import Btn from 'will-ui/components/btn/index'
import supplierData from '../../mock-data/supplier'

const supplierIds = ref<number[]>([])
const disabled = ref(false)

function checkable(item: Record<any, any>, index: number) {
  if (item.Name.indexOf('北京') > -1) {
    return false
  }
  return true
}
function onClear() {
  console.log('清空')
}

onMounted(() => {
  setTimeout(() => {
    supplierIds.value.push(...[791, 792, 781])
  }, 500)
})
</script>
<style module="css" lang="postcss"></style>
