<template>
  <h1>滑块</h1>
  <section :class="css.sec">
    <p><Slider v-model="val" :min="5" :max="50" :step="5" has-input /></p>
  </section>
  <section :class="css.sec">
    <p><Slider v-model="val" :min="5" :max="50" :step="5" /></p>
  </section>
  <p style="margin-top: 20px">
    <Slider
      :class="css.sec2"
      v-model="val2"
      :direction="{ x: false, y: true }" />
  </p>
  <p style="margin-top: 20px">
    <Slider
      :class="css.sec2"
      v-model="val2"
      :min="0"
      :max="100"
      :step="1"
      :direction="{ x: true, y: true }" />
  </p>
</template>
<script lang="ts" setup>
import { watch, ref } from 'vue'
import Slider from 'will-ui/components/slider/index'
const val = ref(15)
const val2 = ref(0)

watch(val, (v) => {
  console.log(v)
})
</script>
<style module="css" lang="postcss">
.sec {
  width: 200px;
}
.sec2 {
}
</style>
