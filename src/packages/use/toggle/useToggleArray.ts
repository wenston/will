import type { Ref, ComputedRef } from 'vue'
import { isRef, ref, computed, unref, watch } from 'vue'
type DataType<T> = Ref<T[]> | T[]
interface InitType<T> {
  index?: Ref<number> | ComputedRef<number> | number
  item?: T
}
export default function useToggleArray<T>(
  data: DataType<T>,
  current?: InitType<T>,
  keyField?: string
) {
  const computedData = computed(() => unref(data))
  const len = computed(() => computedData.value.length)
  const index = ref(0)
  // const item = ref(computedData.value[0])
  const item = ref<T>()

  function _set(current: InitType<T>) {
    if (current) {
      if ('item' in current) {
        item.value = unref(current.item)
        index.value = computedData.value.findIndex((d) => d === item.value)
      } else if ('index' in current) {
        index.value = unref(
          isRef(current.index) ? current.index.value : current.index
        )!
        item.value = computedData.value[index.value]
      }
    }
  }

  function _init() {
    _set(current || { index: index.value })
  }

  function toggle() {
    if (len.value > 0) {
      const nextIndex = (index.value + 1) % len.value
      item.value = computedData.value[nextIndex]
      index.value = nextIndex
    }
    return {
      item: item.value,
      index: index.value
    }
  }
  function prev() {
    if (len.value > 0) {
      let prevIndex = index.value - 1
      if (prevIndex === -1) {
        prevIndex = computedData.value.length + prevIndex
      }
      set({ index: prevIndex })
    }
  }
  function set(current: InitType<T>) {
    _set(current)
  }
  function setByKey(
    k: number | string | boolean | symbol,
    localKeyField?: string
  ) {
    const field = localKeyField || keyField
    if (field) {
      const i = computedData.value.findIndex((el, i) => {
        if (typeof el === 'object') {
          return k === (el as Record<string, any>)[field]
        }
      })
      if (i > -1) {
        index.value = i
        item.value = computedData.value[i]
      }
    }
  }
  function get() {
    const item = computedData.value[index.value]
    return {
      item,
      index: index.value
    }
  }
  _init()
  watch([() => current?.index, () => current?.item, computedData], _init)

  return {
    //toggle是正序切换
    toggle,
    next: toggle,
    //前一个
    prev,
    item,
    index,
    set,
    setByKey,
    get
  }
}
