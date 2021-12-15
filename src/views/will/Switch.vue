<template>
  <h1>Switch</h1>
  <div>
    <Switch v-model="flag"></Switch>
    <Switch v-model="flag"
      style="height:30px;width:49px;"></Switch>

  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import Switch from 'will-ui/components/switch'
const flag = ref(0)
</script>