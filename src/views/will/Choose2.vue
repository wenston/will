<template>
  <h1>多选Choose2</h1>
  <p>
    <Btn>测试按钮</Btn>
  </p>
  <p>
    <Choose2 v-model="supplierIds" :data="supplierData" :checkable="checkable">
      <template #default="{ item, index }">
        {{ item.Name }}
      </template>
    </Choose2>
  </p>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import Choose2 from 'will-ui/components/choose2/index'
import Btn from 'will-ui/components/btn/index'
import supplierData from '../../mock-data/supplier'

const supplierIds = ref([])

function checkable(item: Record<any, any>, index: number) {
  if (item.Name.indexOf('北京') > -1) {
    return false
  }
  return true
}
</script>
<style module="css" lang="postcss"></style>
