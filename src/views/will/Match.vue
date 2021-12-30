<template>
  <h1>{{currentRoute.meta.title}}</h1>
  <p>
    <Match :data="supplier"
      v-model="search.supplierId" />
  </p>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Match from 'will-ui/components/match/index'
import Btn from 'will-ui/components/btn/index'
const { currentRoute } = useRouter()

import supplier from '../../mock-data/supplier'
const search = reactive<{
  supplierId: number | undefined
  supplierName: string
}>({
  supplierId: undefined,
  supplierName: ''
})
watch(
  () => search.supplierId,
  (id) => {
    console.log(id)
  }
)
</script>

<style module="css" lang="postcss">
</style>