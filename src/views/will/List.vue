<template>
  <h1>{{ currentRoute.meta.title }}</h1>
  <p>
    <Btn @click="onShowLoading">加载</Btn>
  </p>
  <p v-loading="{loading}">
    <List :data="supplier" />
  </p>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import List from 'will-ui/components/list/index'
import Btn from 'will-ui/components/btn/index'
import vLoading from 'will-ui/directives/loading'
import supplier from '../../mock-data/supplier'
const { currentRoute } = useRouter()
const loading = ref(false)
const text = ref('正在非常努力的加载中》。')
function onShowLoading() {
  // text.value = '呵呵，努力加载'
  loading.value = !loading.value
}
</script>

<style module="css" lang="postcss"></style>
