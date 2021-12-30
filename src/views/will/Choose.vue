<template>
  <h1>{{currentRoute.meta.title}}</h1>
  <p style="display:flex;">
    <Choose v-model="supplierId"
      @change="onChange"
      clearable>

      <Choose.item v-for="item in supplierData.slice(1,6)"
        :key="item.Id"
        :label="item.Name"
        :value="item.Id"
        :disabled="item.Name.indexOf('北京')>-1">{{item.Name}}</Choose.item>
    </Choose>
  </p>
  <p style="display:flex;">
    <Choose v-model="supplierId3"
      @change="onChange"
      :lazy-load="toLoad"
      bind="v-if"
      clearable>
      <template #default="{data}">
        <Choose.item v-for="item in data"
          :key="item.Id"
          :label="item.Name"
          :value="item.Id"
          :disabled="item.Name.indexOf('米')>-1">{{item.Name}}</Choose.item>
      </template>

    </Choose>
  </p>
  <p style="display: flex;">
    <Btn mode="line"
      type="primary"
      @click="showLoading=!showLoading">加载中</Btn>

    <Loading :show="showLoading"
      size="20px"
      color="var(--w-color-font-2)" />
  </p>
  <p style="margin-top:450px">
    <Choose v-model="supplierId2"
      clearable
      block>
      <Choose.item v-for="item in supplierData"
        :key="item.Id"
        :label="item.Name"
        :value="item.Id"
        :disabled="item.Name.indexOf('北京')>-1">{{item.Name}}</Choose.item>

    </Choose>

  </p>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const { currentRoute } = useRouter()
import { Choose } from 'will-ui/components/choose/index'
import Virtual from 'will-ui/components/virtual/Virtual'
import Loading from 'will-ui/components/loading/index'
import Btn from 'will-ui/components/btn/index'
import supplierData from '../../mock-data/supplier'
const suppliers = ref<{ Id: number; Name: string }[]>([])
const supplierId = ref<number | string>(791)
const supplierId2 = ref<number | string>()
const supplierId3 = ref<number | string>()
const showChoose = ref(false)
const showLoading = ref(false)
function onChange({ label, value }: any) {
  console.log(label, value)
}
async function toLoad() {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res(supplierData)
    }, 1000)
  })
}
onMounted(() => {
  setTimeout(() => {
    supplierId2.value = 34
  }, 200)
})
</script>

<style lang="postcss" module="css">
.list {
  height: 300px;
}
</style>