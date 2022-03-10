<template>
  <h1>切换</h1>
  <p>
    <Btn @click="toggle">{{ trans }}</Btn>
  </p>
  <Toggle
    :transform="trans"
    :data="dataList"
    :class="css.toggleBox"
    direction="y"
    carousel
    @after-toggle="afterEnter"
  >
    <template #default="{ item, index, prev, next }">
      <p :class="css.box" :style="{ backgroundColor: item }" @click="next"></p>
    </template>
    <template #use="{ item, index, prev, next }">
      <p>{{ index }}, {{ item }}</p>
      <p>
        <Btn @click="prev">prev</Btn>
        <Btn @click="next">next</Btn>
      </p>
    </template>
  </Toggle>
  <Toggle :transform="trans" :data="json" :class="css.toggleBox">
    <template #default="{ item, index, prev, next }">
      <p :class="css.box2" @click="next">{{ item.content }}</p>
    </template>
    <template #use="{ item, index, prev, next }">
      <p>{{ index }}, {{ item }}</p>
      <p>
        <Btn @click="prev">prev</Btn>
        <Btn @click="next">next</Btn>
      </p>
    </template>
  </Toggle>
  <p>
    <b>动态数据的情况下：</b>
  </p>
  <p>
    <Toggle :class="css.toggleBox" :transform="trans" :data="dynamicData">
      <template #default="{ item, index, prev, next }">
        <div :class="css.box2">{{ item }}</div>
      </template>
      <template #use="{ item, index, prev, next }">
        <p>
          <Btn @click="toPrev(prev)" type="primary">上一个</Btn>
          <Btn @click="toNext(next)" type="primary">下一个</Btn>
        </p>
      </template>
    </Toggle>
  </p>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
import useToggleArray from 'will-ui/use/toggle/useToggleArray'
import Toggle from 'will-ui/components/toggle/index'
import Btn from 'will-ui/components/btn/index'
const { item: trans, toggle } = useToggleArray<'translate' | 'scale'>([
  'translate',
  'scale'
])
const dataList = ref(['red', 'yellow', 'blue'])
const json = ref([
  {
    key: '1',
    content:
      '撒打发时光大撒旦飞洒地方撒旦发广告23526324234 大概豆腐干但是如果的发挥；离开了ujuiuioou按实际的付款了'
  },
  {
    key: '2',
    content: '往昔所造诸恶业，皆由无始贪嗔痴，从身语意之所生，一切罪障皆忏悔'
  }
])
const dynamicData = ref([getRandom()])

function getRandom() {
  return Math.floor(Math.random() * 2000 + 100)
}
async function afterEnter({
  prev,
  next,
  delay
}: {
  prev: () => void
  next: () => void
  delay: (n?: number) => Promise<void>
}) {
  await delay()
  next()
}

function toPrev(prev: () => void) {
  dynamicData.value.unshift(getRandom())
  // prev()
}
function toNext(next: () => void) {
  dynamicData.value.push(getRandom())
  next()
}
</script>

<style lang="postcss" module="css">
.toggleBox {
  width: 200px;
  height: 200px;
  overflow: hidden;
  outline: 2px solid cyan;
}
.box {
  width: 100%;
  height: 100%;
  /* box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3), -2px 0 10px rgba(0, 0, 0, 0.1); */
}
.box2 {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
</style>
