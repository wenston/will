import type { Ref, ComputedRef } from 'vue'
import { isRef, ref, computed, unref, watch } from 'vue'
type DataType = Ref<unknown[]> | unknown[]
interface InitType {
  index?: Ref<number> | ComputedRef<number> | number
  item?: Ref<any> | ComputedRef<any> | any
}
export default function useToggleArray(data: DataType, current?: InitType) {
  const computedData = computed(() => unref(data))
  const len = computed(() => computedData.value.length)
  const index = ref(0)
  const item = ref(computedData.value[0])

  function _set(current: InitType) {
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
  }
  function set(current: InitType) {
    _set(current)
  }
  _init()
  watch([() => current?.index, () => current?.item, computedData], _init)

  return {
    toggle,
    item,
    index,
    set
  }
}
