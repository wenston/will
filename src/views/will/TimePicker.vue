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
  <p>时分秒的选择</p>
  <TimePicker
    v-model="startTime"
    :clearable="ps.clearable"
    :disabled="ps.disabled"
    :block="ps.block"
  />
  <p>时分的选择</p>
  <TimePicker
    v-model="hm"
    :clearable="ps.clearable"
    format="hh:mm"
    placeholder="时：分"
  />
  <p>时的选择</p>
  <TimePicker
    v-model="h"
    :clearable="ps.clearable"
    format="hh"
    placeholder="小时"
  />
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import TimePicker from 'will-ui/components/time/index'
import Btn from 'will-ui/components/btn/index'
const startTime = ref<string>('20:11:30')
const hm = ref()
const h = ref()
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
