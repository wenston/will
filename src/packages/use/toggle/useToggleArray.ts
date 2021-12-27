import type { Ref, ComputedRef } from 'vue'
import { isRef, ref, computed, unref, watch } from 'vue'
type DataType<T> = Ref<T[]> | T[]
interface InitType<T> {
  index?: Ref<number> | ComputedRef<number> | number
  item?: T
}
export default function useToggleArray<T>(
  data: DataType<T>,
  current?: InitType<T>
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
    _set(current ?? {})
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
  function set(current: InitType<T>) {
    _set(current)
  }
  function get() {
    const index = computedData.value.findIndex((v) => v === item.value)
    return {
      item: item.value,
      index
    }
  }
  _init()
  watch([() => current?.index, () => current?.item, computedData], _init)

  return {
    toggle,
    item,
    index,
    set,
    get
  }
}
