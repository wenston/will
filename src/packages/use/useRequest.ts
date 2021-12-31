import type { Ref } from 'vue'
import { ref } from 'vue'
import { isArray } from '../util'
export default function useRequest<T>(
  requestFn: undefined | ((para?: Ref<any>) => Promise<T>),
  para?: Ref<any>,
  manual = false
) {
  const loading = ref(false)
  const empty = ref(false)
  const data: Ref<T | T[] | undefined | null> = ref()

  async function get() {
    try {
      if (loading.value) {
        return
      }
      loading.value = true
      data.value = await requestFn?.(para?.value)
      //   console.log(data.value)
      if (!data.value || (isArray(data.value) && data.value.length > 0)) {
        empty.value = false
      } else {
        empty.value = true
      }
      loading.value = false
    } catch (err) {
      loading.value = false
    } finally {
    }
  }

  !manual && get()

  return {
    loading,
    empty,
    data,
    get
  }
}
