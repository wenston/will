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
  <Transfer type="loop" :data="loopData" :class="css.trans">
    <template #default="{ item, index }">
      <div :class="css.item">{{ item.key }}</div>
    </template>
    <template #use="{prev,next}">
      <Btn @click="prev">上一个</Btn>
      <Btn @click="next">下一个</Btn>
    </template>
  </Transfer>
</template>
<script setup lang="ts">
import { h, onMounted, ref, Teleport, useCssModule } from 'vue'
import Transfer from 'will-ui/components/transfer/index'
import Notice from 'will-ui/components/notice/index'
import Btn from 'will-ui/components/btn/index'
import Icon from 'will-ui/components/icon/index'
import Tooltip from 'will-ui/components/tooltip/index'
const dir = ref('x')
const ctrl = ref<HTMLElement>()
const showUse = ref(false)
const dataList = ref([{ key: getRandom(), content: '哈哈' }])
const loopData = ref([{ key: '1' }, { key: '2' }, { key: '3' }])
const css = useCssModule('css')
function toggleLayout() {
  if (dir.value === 'x') {
    dir.value = 'y'
  } else {
    dir.value = 'x'
  }
  Notice.open({
    placement: 'top',
    content: () => {
      return h(
        'div',
        {
          class: [css.notice]
        },
        `滚动方向已经切换到了 ${dir.value} 方向`
      )
    }
  })
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
.notice {
  padding: 20px;
  background-color: var(--w-color-primary);
  color: white;
  font-size: 14px;
  border-radius: var(--w-radius);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
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
    color: var(--w-color-font-4);
    height: 100%;
  }
}
</style>
