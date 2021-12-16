<template>
  <h1>{{currentRoute.meta.title}}</h1>
  <p style="display:flex;">
    <Choose v-model="supplierId"
      @change="onChange"
      clearable>

      <Choose.item v-for="item in supplierData"
        :key="item.Id"
        :label="item.Name"
        :value="item.Id"
        :disabled="item.Name.indexOf('北京')>-1">{{item.Name}}</Choose.item>
    </Choose>
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
import supplierData from '../../mock-data/supplier'
const supplierId = ref<number | string>()
const supplierId2 = ref<number | string>()
const showChoose = ref(false)

function onChange({
  label,
  value
}: {
  readonly label: number | string | undefined
  readonly value: number | string | undefined
}) {
  console.log(label, value)
}
</script>

<style lang="postcss" module="css">
.list {
  height: 300px;
}
</style>