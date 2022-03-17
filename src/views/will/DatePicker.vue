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
  <!-- <p>年月日的选择</p>
  <DatePicker
    v-model="startDate"
    :clearable="ps.clearable"
    :disabled="ps.disabled"
    :block="ps.block"
  />
  <p>年月的选择</p>
  <DatePicker
    v-model="ym"
    :clearable="ps.clearable"
    format="yyyy-MM"
    placeholder="xxxx年-xx月"
  />
  <p>年的选择</p>
  <DatePicker
    v-model="y"
    :clearable="ps.clearable"
    format="yyyy"
    placeholder="请选择年份"
  /> -->
  <p>年月日时分秒的选择</p>
  <p>
    <DatePicker
      v-model="ymdhms"
      :clearable="ps.clearable"
      format="yyyy-MM-dd HH:mm:ss"
      placeholder="请选择日期和时间"
    />
  </p>
  <p>年月日时分的选择</p>
  <p>
    <DatePicker
      v-model="ymdhm"
      :clearable="ps.clearable"
      format="yyyy-MM-dd HH:mm"
      placeholder="年月日时分"
    />
  </p>
  <p>年月日时的选择</p>
  <p>
    <DatePicker
      v-model="ymdh"
      :clearable="ps.clearable"
      format="yyyy-MM-dd HH"
      placeholder="年月日时"
    />
  </p>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import DatePicker from 'will-ui/components/date/index'
import Btn from 'will-ui/components/btn/index'
const startDate = ref()
const ym = ref()
const y = ref()
const ymdhms = ref('2022-03-20 10:20:30')
const ymdhm = ref()
const ymdh = ref()
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
