<template>
  <h1>Switch</h1>
  <div>
    <Switch v-model="flag"></Switch>

  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import Switch from '../packages/components/switch'
const flag = ref(0)
</script>