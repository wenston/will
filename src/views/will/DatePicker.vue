<template>
  <h1>日期选择器</h1>
  <p>
    <Btn @click="toChangeProp(ps, 'clearable')">可清空</Btn>
    <Btn
      @click="toChangeProp(ps, 'disabled')"
      :type="ps.disabled ? 'primary' : 'default'"
    >
      {{ ps.disabled ? '启用' : '禁用' }}
    </Btn>
    <Btn @click="toChangeProp(ps, 'block')">block</Btn>
  </p>
  <DatePicker
    v-model="startDate"
    :clearable="ps.clearable"
    :disabled="ps.disabled"
    :block="ps.block"
  />
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import DatePicker from 'will-ui/components/date/index'
import Btn from 'will-ui/components/btn/index'
const startDate = ref()
interface MyType {
  clearable?: boolean
  disabled?: boolean
  block?: boolean
}
const ps = reactive<MyType>({
  clearable: true,
  disabled: false,
  block: false
})

function toChangeProp<T extends MyType, K extends keyof MyType>(obj: T, p: K) {
  obj[p] = !obj[p]
}
</script>
