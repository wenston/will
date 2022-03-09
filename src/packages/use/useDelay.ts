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
  async function delay(handler?: Function | number, delayTime?: number) {
    // console.log(arguments.length)
    const len = arguments.length
    const ms = arguments[0] as number
    stop()
    if (len === 1 && typeof arguments[0] === 'number') {
      await new Promise((res) => {
        timer.value = setTimeout(() => {
          res(timer.value)
        }, ms ?? msTime)
      })
    } else {
      await new Promise((res) => {
        timer.value = setTimeout(() => {
          if (handler && typeof handler === 'function') {
            handler()
          }
          res(timer.value)
        }, delayTime ?? msTime)
      })
    }
  }
  onUnmounted(clear)
  return { clear, delay, stop }
}
