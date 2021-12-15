<template>
  <section>
    <h1>checkbox</h1>
    <div>
      <Checkbox v-model="isChecked"
        @change="onChange">是否吃饭了呢</Checkbox>

    </div>
    <div>
      <h3>你喜欢哪个城市？</h3>
      <Checkbox v-for="c in citys"
        :key="c"
        :text="c"
        :value="c"
        :disabled="c==='上海'"
        v-model="checkedCitys" />
    </div>
  </section>
</template>
<script  setup lang="ts">
import { ref, reactive, watch } from 'vue'
import Btn from 'will-ui/components/btn/index'
import Checkbox from 'will-ui/components/checkbox/index'
const citys = ref(['北京', '上海', '广州', '深圳'])
const isChecked = ref(0)
const checkedCitys = ref(['北京'])
function onChange(e: any) {
  console.log('变化了：', e)
}
setTimeout(() => {
  isChecked.value = 1
  checkedCitys.value.push('深圳')
}, 1000)

watch(checkedCitys, (c) => {
  console.log(c)
})
</script>
<style lang="postcss" module="css">
.box {
  display: inline-flex;
  padding: 5px 10px;
  color: white;
}
</style>