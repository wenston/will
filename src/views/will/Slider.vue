<template>
  <h1>滑块</h1>
  <Layer v-model:show="show">
    <template #trigger="{ toggle }">
      <Btn>显示/隐藏</Btn>
    </template>

    <section :class="css.sec">
      <Slider v-model="val" :min="5" :max="50" :step="5" has-input />
    </section>
  </Layer>

  <p style="margin-top: 20px">
    <Slider v-model="val2" :direction="{ x: false, y: true }" />
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
import Btn from 'will-ui/components/btn'
import Layer from 'will-ui/components/layer'
import Popup from 'will-ui/components/popup'
import Tooltip from 'will-ui/components/tooltip'
import Drawer from 'will-ui/components/drawer'
const show = ref(false)
const val = ref(15)
const val2 = ref(20)

watch(val, (v) => {
  // console.log(v)
})
</script>
<style module="css" lang="postcss">
.sec {
  padding: 20px;
  width: 300px;
  height: 200px;
}
.sec2 {
}
</style>
