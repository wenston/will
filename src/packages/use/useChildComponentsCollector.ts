import type { ComponentInternalInstance } from 'vue'
import { onMounted, onUpdated, onUnmounted } from 'vue'
import { ref, computed, getCurrentInstance } from 'vue'
export default function useChildComponentsCollector() {
  const currentInstance = getCurrentInstance()
  const currentUid = computed(() => {
    console.log('computed')
    if (currentInstance?.uid) {
      return Symbol(currentInstance.uid)
    }
  })
  const container = ref<Map<symbol, ComponentInternalInstance>>(new Map())

  function collector(ins: typeof currentInstance) {
    if (ins !== null) {
      const _uid = Symbol(ins.uid)
      container.value.set(_uid, ins)
    }
  }

  function remove() {
    if (currentInstance) {
      //   container.value.delete()
    }
  }

  onMounted(() => {
    console.log('onMMMM')
    collector(currentInstance)
  })
  onUnmounted(remove)

  return {
    container,
    collector
  }
}
