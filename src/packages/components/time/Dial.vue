<template>
  <div class="w-time-dial">
    <div class="w-time-dial-title">
      <span v-if="has.h">时</span>
      <span v-if="has.m">分</span>
      <span v-if="has.s">秒</span>
    </div>
    <div class="w-time-dial-btn" ref="top_btn"></div>
    <div class="w-time-dial-list" v-if="isMounted">
      <Toggle
        v-for="(a, i) in arr"
        v-bind="toggleOptions"
        :data="a"
        :index="getIndex(i)"
        @wheel="handleWheel(i, $event)"
      >
        <template #default="{ item }">
          <div
            v-for="n in item"
            :class="[
              'w-dial-item-item',
              {
                'w-dial-item-readonly':
                  (i === 0 && !has.h) ||
                  (i === 1 && !can.m) ||
                  (i === 2 && !can.s),
                'w-dial-item-selected':
                  (i === 0 && h == n) ||
                  (i === 1 && m == n) ||
                  (i === 2 && s == n)
              }
            ]"
            @click="handleClick(i, n)"
          >
            {{ n }}
          </div>
        </template>
        <template #use="{ prev, next }">
          <teleport :to="top_btn">
            <Icon name="w-icon-sort-down" size="18px" rotate @click="prev" />
          </teleport>
          <teleport :to="bottom_btn">
            <Icon name="w-icon-sort-down" size="18px" @click="next" />
          </teleport>
        </template>
      </Toggle>
    </div>
    <div class="w-time-dial-btn" ref="bottom_btn"></div>
  </div>
</template>
<script setup lang="ts">
import './style/dial.css'
import { ref, onMounted, computed, watchEffect } from 'vue'
import Toggle from '../toggle/index'
import Icon from '../icon/index'
import type { TimeFormatType } from '../../config/types'
const props = withDefaults(
  defineProps<{
    format?: TimeFormatType
    value?: string
  }>(),
  { format: 'HH:mm:ss' }
)
const emit = defineEmits<{ (e: 'change', hms?: string): void }>()
const [h, m, s] = useHms(props)
const isMounted = ref(false)
const bottom_btn = ref<HTMLElement>()
const top_btn = ref<HTMLElement>()
const padString = (n: number) => (n >= 0 && n < 10 ? '0' + n : n + '')
const createNumberArray = (total: number, size: number = 6) =>
  Array.from({ length: total / size }, (el, i) =>
    Array.from({ length: size }, (item, index) => padString(i * size + index))
  )
//展不展示时分秒
const has = computed(() => {
  const f = props.format
  const m = f.indexOf('mm') > -1
  const h = f.indexOf('HH') > -1
  const s = f.indexOf('ss') > -1
  console.log(f, h)
  return { m, h, s }
})
//能不能进行选择时分秒的操作
const can = computed(() => {
  const v = props.value
  const len = v?.length
  if (len) {
    let h = true,
      m = false,
      s = false
    if (len >= 2) {
      m = true
    }
    if (len >= 5) {
      s = true
    }
    return { h: h && has.value.h, m: m && has.value.m, s: s && has.value.s }
  }
  return { h: false, m: false, s: false }
})
const arr = computed(() => {
  const a: string[][][] = []
  if (has.value.h) {
    a.push(createNumberArray(24))
    if (has.value.m) {
      a.push(createNumberArray(60))
      if (has.value.s) {
        a.push(createNumberArray(60))
      }
    }
  }
  return a
})
const toggleOptions = {
  class: 'w-dial-item',
  transform: 'translate' as 'translate',
  direction: 'y' as 'y',
  itemClass: 'w-dial-toggle-item'
}

//template里可以推断出组件定义的数据类型，但这里仍然要定义一遍，有其他办法重用类型吗？
function handleWheel(
  i: number,
  {
    event,
    prev,
    next,
    delay
  }: {
    event: WheelEvent
    [k: string]: any
  }
) {
  if (event.deltaY > 0) {
    delay(next, 100)
  } else {
    delay(prev, 100)
  }
}

function handleClick(i: number, v: string) {
  const arr: string[] = []
  if (i === 0) {
    if (has.value.h) h.value = v
  } else if (i === 1) {
    if (can.value.m) m.value = v
    else {
      return
    }
  } else {
    if (can.value.s) s.value = v
    else {
      return
    }
  }
  if (h.value) {
    arr.push(h.value)
  }
  if (m.value) {
    arr.push(m.value)
  }
  if (s.value) {
    arr.push(s.value)
  }
  emit('change', arr.join(':'))
}

function getIndex(i: number) {
  if (i === 0) {
    if (h.value === undefined) {
      return 0
    } else {
      const j = parseInt('' + Number(h.value) / 6)
      return j
    }
  } else if (i === 1) {
    if (m.value === undefined) {
      return 0
    } else {
      return parseInt('' + Number(m.value) / 6)
    }
  } else if (i === 2) {
    if (s.value === undefined) {
      return 0
    } else {
      return parseInt('' + Number(s.value) / 6)
    }
  }
}

onMounted(() => {
  isMounted.value = true
})

function useHms(props: Record<string, string>) {
  const h = ref<string>()
  const m = ref<string>()
  const s = ref<string>()
  watchEffect(() => {
    ;[h.value, m.value, s.value] = (props.value || '').split(':')

    // console.log(h.value, m.value, s.value)
  })

  return [h, m, s]
}
</script>
