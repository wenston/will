<template>
  <h1>滑块</h1>
  <p></p>
  <Slider v-model="val" />
</template>
<script lang="ts" setup>
import Slider from 'will-ui/components/slider/index'
const val = 0
</script>
