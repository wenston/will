<template>
  <h1>滑块</h1>
  <section :class="css.sec">
    <p></p>
    <Slider v-model="val" />
  </section>
</template>
<script lang="ts" setup>
import Slider from 'will-ui/components/slider/index'
const val = 0
</script>
<style module="css" lang="postcss">
.sec {
  width: 200px;
}
</style>
