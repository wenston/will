<template>
  <h1>{{currentRoute.meta.title}}</h1>
  <p>
    <Write :class="css.write"
      @clear="onClear"
      clearable
      v-model="txt1"></Write>
  </p>
  <p>
    <Write :class="css.write"
      clearable
      v-model="txt1">
      <template #prepend>
        <Icon name="w-icon-radio" />
      </template>
      <template #default>
        <span :class="css.yuan">元</span>
      </template>
    </Write>
  </p>
  <p>
    <Write block>
      <template #before>
        <span>姓名：</span>
      </template>
      <template #after>
        <span>&#12288;</span>
        <Btn mode="line"
          type="primary">提交</Btn>
      </template>
    </Write>
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
import Write from 'will-ui/components/write/index'
import Btn from 'will-ui/components/btn/index'
import Icon from 'will-ui/components/icon/index'
const { currentRoute } = useRouter()
const txt1 = ref('')
function onFocus() {
  console.log('focus了')
}
function onClear({ input }) {
  console.log(input)
  input?.focus()
}
watch(txt1, (t) => {
  console.log(t)
})
</script>

<style module="css" lang="postcss">
.write {
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