import useGlobalZIndex from '../../../../use/useGlobalZIndex'
interface WrapperType {
  [k: string]: HTMLElement
}
let WRAPPERS: WrapperType = {}
function createNoticeWrapper(placement: string) {
  const { zIndex, add } = useGlobalZIndex()
  if (placement in WRAPPERS) {
    const el = WRAPPERS[placement]
    el.style.zIndex = add() + ''
    return el
  }
  const el = document.createElement('div')
  const id = `notice_container_${(new Date() as any) - 0}`
  const klass = 'w-notice w-notice--' + placement
  el.id = id
  el.className = klass
  el.style.zIndex = zIndex.value + ''
  WRAPPERS[placement] = el
  document.body.appendChild(el)
  return el
}

function removeNoticeWrapper(el: HTMLElement) {
  let p = ''
  for (const pla in WRAPPERS) {
    if (WRAPPERS[pla] === el) {
      p = pla
    }
  }
  if (p) {
    document.body.removeChild(el)
    delete WRAPPERS[p]
  }
}

function clearNoticeWrapper() {
  for (const p in WRAPPERS) {
    if (WRAPPERS[p]) {
      document.body.removeChild(WRAPPERS[p])
      delete WRAPPERS[p]
    }
  }
}

export { createNoticeWrapper, removeNoticeWrapper, clearNoticeWrapper }
