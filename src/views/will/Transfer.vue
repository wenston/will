<template>
  <h1>移动切换</h1>
  <p style="padding-left: 300px">
    <Btn @click="toggleLayout">移动方位切换</Btn>
  </p>
  <Transfer
    :data="dataList"
    :class="css.trans"
    :direction="dir"
    @afterEnter="afterEnter"
  >
    <template #default="{ item, index }">
      <div :class="css.item">
        {{ item.key }}
      </div>
    </template>
    <template #use="{ prev, next }">
      <Teleport :to="ctrl" v-if="showUse">
        <p style="padding-left: 300px">
          <Tooltip placement="left">
            <template #trigger>
              <Btn @click="toPrev(prev)">
                <Icon name="w-icon-sort-down" size="30px" rotate />
              </Btn>
            </template>
            <span>上一个</span>
          </Tooltip>
          <Tooltip placement="right">
            <template #trigger>
              <Btn @click="toNext(next)">
                <Icon name="w-icon-sort-down" size="30px" />
              </Btn>
            </template>
            <span>下一个</span>
          </Tooltip>
        </p>
      </Teleport>
    </template>
  </Transfer>
  <div ref="ctrl"></div>
</template>
<script setup lang="ts">
import { onMounted, ref, Teleport } from 'vue'
import Transfer from 'will-ui/components/transfer/index'
import Btn from 'will-ui/components/btn/index'
import Icon from 'will-ui/components/icon/index'
import Tooltip from 'will-ui/components/tooltip/index'
const dir = ref('x')
const ctrl = ref<HTMLElement>()
const showUse = ref(false)
const dataList = ref([{ key: getRandom(), content: '哈哈' }])

function toggleLayout() {
  if (dir.value === 'x') {
    dir.value = 'y'
  } else {
    dir.value = 'x'
  }
}

function getRandom() {
  return Math.floor(Math.random() * 1200)
}

function toPrev(fn: () => {}) {
  fn()
  dataList.value.unshift({
    key: getRandom(),
    content: '嘿嘿'
  })
}
function toNext(fn: () => {}) {
  fn()
  dataList.value.push({
    key: getRandom(),
    content: '呵呵'
  })
}

function afterEnter(method: 'pop' | 'shift') {
  dataList.value[method]()
}

onMounted(() => {
  console.log('页面挂载了')
  showUse.value = true
})
</script>
<style module="css" lang="postcss">
.trans {
  border-radius: var(--w-radius);
  width: 240px;
  height: 240px;
  border: 1px solid var(--w-color-border);
  & .item {
    display: flex;
    align-items: center;
    border-radius: var(--w-radius);
    justify-content: center;
    font-size: 50px;
    /* flex: 0 0 calc(100% - 30px); */
    color: var(--w-color-font-4);
    &.one {
      background-color: lightcyan;
    }
    &.two {
      background-color: lightgoldenrodyellow;
    }
    &.three {
      background-color: cadetblue;
    }
  }
}
</style>
