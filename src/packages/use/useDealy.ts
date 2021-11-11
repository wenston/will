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
  function delay(handler: Function, delayTime?: number) {
    stop()
    timer.value = setTimeout(handler, delayTime ?? msTime)
  }
  onUnmounted(clear)
  return { clear, delay, stop }
}
