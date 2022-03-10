<template>
  <h1>{{ currentRoute.meta.title }}</h1>
  <section>
    <h3>从已有数据中搜索</h3>
    <p>
      <Match
        :data="supplier"
        v-model="search.supplierId"
        :checkable="checkable"
      >
        <template #default="{ item, index }">
          {{ index }}，{{ item.Id }}--{{ item.Name }}
        </template>
      </Match>
    </p>
  </section>

  <section style="margin-top: 20px">
    <h3>数据懒加载</h3>
    <p style="margin-top: 10px">
      <Match
        :data="lazyData"
        v-model="supplierId2"
        :lazy-load="lazyLoad"
        @search="toSearch2"
      />
    </p>
  </section>

  <section style="margin: 20px 0 0 0">
    <h3>每次都从后台数据搜索，适用于大数据量的情况</h3>
    <p>
      <Match
        :request="getSupplier"
        v-model="search.supplierId3"
        placeholder="输入关键字从后台搜索"
      />
    </p>
  </section>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Match from 'will-ui/components/match/index'
import Btn from 'will-ui/components/btn/index'

import supplier from '../../mock-data/supplier'
import { isObject } from 'will-ui/util'
const { currentRoute } = useRouter()
const lazyData = ref<Record<string, any>[]>([])
const supplierId2 = ref()
const search = reactive<{
  supplierId: number | undefined
  supplierName: string
  supplierId3: string
}>({
  supplierId: 781,
  supplierName: '',
  supplierId3: ''
})
function checkable(item: Record<string, any> | string | number, index: number) {
  if (isObject(item)) {
    return item.Name.indexOf('北京') === -1
  }
  return false
}
function getSupplier(): Promise<Record<string, any>[]> {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res(supplier)
    }, 500)
  })
}
function lazyLoad(): Promise<Record<string, any>[]> {
  return new Promise((res, rej) => {
    setTimeout(() => {
      lazyData.value = supplier
      res(supplier)
    }, 1500)
  })
}
function toSearch2({ val, clear }: any) {
  console.log('搜索的是：', val)
}
watch([supplierId2, () => search.supplierName], ([id, name]) => {
  console.log('每次都从后台拿数据：', id)
})
onMounted(() => {
  setTimeout(() => {
    search.supplierId = 790
  }, 1500)
})
</script>

<style module="css" lang="postcss"></style>
