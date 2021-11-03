import type { Ref } from 'vue'
import { ref, computed, unref, watch } from 'vue'
type DataType = Ref<Map<any, any>> | Map<any, any>

export default function useToggleMap(data: DataType, currentkey?: Ref<any> | any) {
  const arrarr = computed(() => [...unref(data)])
  const size = computed(() => arrarr.value.length)
  const item = ref<any[]>()
  const index = ref(0)
  function _init() {
    if (size.value > 0) {
      let i = arrarr.value.findIndex(([k, v], i) => {
        return k === unref(currentkey)
      })
      if (i === -1) {
        i = 0
      }
      index.value = i
      item.value = arrarr.value[i]
    }
  }
  function toggle() {
    if (size.value > 0) {
      const nextIndex = (index.value + 1) % size.value
      item.value = arrarr.value[nextIndex]
      index.value = nextIndex
    }
  }
  _init()
  watch([currentkey, data], _init)
  return {
    toggle,
    item,
    index
  }
}
