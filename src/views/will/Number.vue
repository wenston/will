<template>
  <h1>{{currentRoute.meta.title}}</h1>
  <p>
    <Number :class="css.number"
      :max="10"
      :min="2"
      @clear="onClear"
      clearable
      v-model="txt1"></Number>
  </p>
  <p>
    <Number :class="css.number"
      clearable
      v-model="txt1">
      <template #prepend>
        <Icon name="w-icon-radio" />
      </template>
      <template #default>
        <span :class="css.yuan">元</span>
      </template>
    </Number>
  </p>
  <p>
    <Number disabled
      block>
      <template #before>
        <span>姓名：</span>
      </template>
      <template #after>
        <span>&#12288;</span>
        <Btn mode="line"
          type="primary">提交</Btn>
      </template>
    </Number>
  </p>
  <!-- <p>
    <Btn @click="beforeShow('left')">左侧</Btn>
    <Btn @click="beforeShow('right')">右侧</Btn>
    <Btn @click="beforeShow('top')">上侧</Btn>
    <Btn @click="beforeShow('bottom')">下侧</Btn>
  </p> -->
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Number from 'will-ui/components/number/index'
import Btn from 'will-ui/components/btn/index'
import Icon from 'will-ui/components/icon/index'
const { currentRoute } = useRouter()
const txt1 = ref<number | string>(3)
function onFocus() {
  console.log('focus了')
}
function onClear({ input }: {input:HTMLInputElement}) {
  console.log(input)
  input?.focus()
}
watch(txt1, (t) => {
  console.log('监控到了数值变化：', t)
})
</script>

<style module="css" lang="postcss">
.number {
  color: var(--w-color-font-2);
}
.yuan {
  align-self: stretch;
  display: flex;
  align-items: center;
  padding-left: 9px;
  border-left: 1px solid var(--w-color-border);
}
</style>