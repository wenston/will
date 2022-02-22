import { ref, onUnmounted } from 'vue'
export default function useDelay(msTime = 200) {
  const timer = ref<any>(null)

  function clear() {
    stop()
    timer.value = null
  }
  function stop() {
    clearTimeout(timer.value)
  }
  async function delay(handler?: Function, delayTime?: number) {
    stop()
    await new Promise((res) => {
      timer.value = setTimeout(() => {
        handler?.()
        res(timer.value)
      }, delayTime ?? msTime)
    })
  }
  onUnmounted(clear)
  return { clear, delay, stop }
}
