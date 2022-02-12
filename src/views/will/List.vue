<template>
  <h1>{{ currentRoute.meta.title }}</h1>
  <p>
    <List :data="supplier" />
  </p>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import List from 'will-ui/components/list/index'
import Btn from 'will-ui/components/btn/index'
import supplier from '../../mock-data/supplier'
const { currentRoute } = useRouter()
</script>

<style module="css" lang="postcss"></style>
