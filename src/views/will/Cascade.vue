<template>
  <h1>级联选择</h1>

  <p>
    <Btn @click="toSet('block')">长短切换</Btn>
    <Btn @click="toSet('clearable')">可清空切换</Btn>
    <Btn @click="toSet('disabled')">启禁用</Btn>
  </p>
  <p>
    一般用法：
  </p>
  <p>
    <Cascade v-model="myArea" v-bind="cascadeOptions" />
  </p>
  <p>延迟加载(暂未实现)</p>
  <p>
    <Cascade v-model="area2" v-bind="cascadeOptions2" />
  </p>
</template>
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import Cascade from 'will-ui/components/cascade/index'
import areaData from '../../mock-data/area'
import Btn from 'will-ui/components/btn/index'

const myArea=ref<Record<any,any>[]>([
  // {code:'21',name:'辽宁省'},
  // {code:'2105',name:'本溪市'},
  // {code:'210505',name:'南芬区'}
])
const area2 = ref<Record<any,any>[]>([])
const lazyData = ref([])
const ps = reactive({
  block: false,
  disabled: false,
  clearable: false
})

const cascadeOptions = computed(() => {
  return {
    ...ps,
    keyField: 'code',
    textField: 'name',
    childField: 'detail',
    data: areaData,
    placeholder: '请选择区域',

  }
})

const cascadeOptions2 = computed(()=>{
  return {...cascadeOptions.value, data: lazyData.value}
})

function toSet(p: 'block' | 'disabled' | 'clearable') {
  ps[p] = !ps[p]
}
watch(myArea,(a:Record<any,any>[])=>{
  console.log('监控到了选择的变化',a)
})
</script>

<style lang="postcss" module="css"></style>
