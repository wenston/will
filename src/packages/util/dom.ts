import { isRef, unref, isReactive, StyleHTMLAttributes } from 'vue'
import type { EmptyObject, RectType } from '../config/types'
import { isObject, isString } from './tools'
const win = window
const doc = document

export const transitionState: string[] = [
  'enter-from',
  'enter-active',
  'leave-to',
  'leave-active'
]

export function isWindow(v: any) {
  return v === window
}

export function isElement(v: any): v is HTMLElement {
  return v && v instanceof HTMLElement
}
function isId(str: string) {
  return str.charAt(0) === '#'
}
function isClass(str: string) {
  return str.charAt(0) === '.'
}
function $(str: string) {
  return document.querySelector(str)
}
export function isDocumentBody(str: any) {
  return str === 'body' || str === document.body
}

export function getUnit(value: string | number) {
  const unit = String(value)
    .replace(/[\-\.\d]/gi, '')
    .toLowerCase()
  return unit
}

export function hasUnit(value: string | number) {
  const units = ['px', 'em', 'pt', 'vh', 'vw', 'rem']
  // console.log(units.indexOf(unit) > -1)
  const unit = getUnit(value)
  // return units.indexOf(getUnit(value)) > -1
  return unit !== ''
}

export function toPX(el: HTMLElement, value: string | number): number {
  const v = parseFloat(value + '')
  const unit = getUnit(value)
  const fontSize = parseInt(getStyle(el, 'font-size'))
  if (unit !== '') {
    if (unit === 'em') {
      return v * fontSize
    }
  }
  return 0
}

export function getStyle(elem: HTMLElement, prop: any) {
  return win.getComputedStyle(elem, null)[prop]
}

export function setStyle(elem: HTMLElement) {
  const set = (prop: string, value: string | null) => {
    elem.style.setProperty(prop, value)
    return set
  }
  return set
}

export function isDisplayNone(elem: HTMLElement) {
  return getStyle(elem, 'display') === 'none'
}

export function setAttr(elem: HTMLElement, attrs: EmptyObject) {
  if (elem) {
    for (const prop in attrs) {
      elem.setAttribute('tabindex', attrs[prop])
    }
  }
}

export function getWindowSize() {
  return {
    outer: {
      height: win.outerHeight,
      width: win.outerWidth
    },
    //inner???????????????????????????????????????
    inner: {
      height: win.innerHeight,
      width: win.innerWidth
    }
  }
}
//???????????????????????????
export function getPageScroll() {
  return {
    x: win.pageXOffset,
    y: win.pageYOffset
  }
}

//???????????????????????????
export function getPageSize() {
  return {
    height: Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight),
    width: Math.max(doc.body.scrollWidth, doc.documentElement.scrollWidth)
  }
}

export function getBoundingClientRect(elem: HTMLElement) {
  const _el = getElement(elem)
  if (_el && isElement(_el)) {
    return _el.getBoundingClientRect()
  }
  return {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    bottom: 0,
    right: 0
  } as DOMRect
}

export function getOffset(elem: HTMLElement) {
  return {
    left: elem.offsetLeft,
    top: elem.offsetTop
  }
}

//????????????????????????
export function getScrollbarWidth() {
  let noScroll,
    scroll,
    oDiv = document.createElement('DIV')
  oDiv.style.cssText =
    'position:fixed; top:-1000px; width:100px; height:100px; overflow:hidden;'
  noScroll = document.body.appendChild(oDiv).clientWidth
  oDiv.style.overflowY = 'scroll'
  scroll = oDiv.clientWidth
  document.body.removeChild(oDiv)
  return noScroll - scroll
}

// ????????????
export function getElement(
  elem: any
): HTMLElement | typeof window | Document | undefined {
  // const el = isRef(elem) ? elem.value : elem
  const el = unref(elem)
  let _: HTMLElement | typeof window | Document | undefined = undefined
  if (el === window) {
    _ = window
  } else if (el === document) {
    _ = document
  } else if (isElement(el)) {
    _ = el as HTMLElement
  } else if (isDocumentBody(el)) {
    _ = document.body
  } else if (isString(el)) {
    if (isId(el) || isClass(el)) {
      _ = $(el) as HTMLElement
    }
  } else if (isObject(el)) {
    //?????????????????????Proxy{...}
    const _el = el.$el as HTMLElement
    if (isElement(_el)) {
      _ = _el
    }
  }
  return _
}

export function getElementPositionInPage(elem: any): RectType {
  let _el = getElement(elem)

  const { x: left, y: top } = getPageScroll()
  if (_el && isElement(_el)) {
    const rect = getBoundingClientRect(_el)
    return {
      left: left + rect.left,
      top: top + rect.top,
      right: rect.right + left,
      bottom: rect.bottom + top,
      width: rect.width,
      height: rect.height
    }
  }
  return {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0
  }
}

//??????????????????????????????
export function getInvisibleElementSize(
  el: any, //??????????????????
  nearby: boolean = false,
  relate?: any, //????????????
  transitionName?: string
) {
  let width: number = 0,
    height: number = 0
  function _clone_calc_size(_el: HTMLElement) {
    let parentNode: HTMLElement | ParentNode = doc.body
    if (nearby) {
      const _relate = getElement(relate)
      if (_relate && isElement(_relate)) {
        const p = _relate.parentNode
        if (p !== null) {
          parentNode = p
        }
      }
    }
    const node = _el.cloneNode(true) as HTMLElement
    if (transitionName) {
      removeClass(
        node,
        transitionState.map((s) => transitionName + '-' + s)
      )
    }
    node.style.display = 'block'
    node.style.opacity = '0'
    parentNode.appendChild(node)
    ;({ width, height } = getBoundingClientRect(node))
    parentNode.removeChild(node)
  }

  const _el = getElement(el)
  if (_el && isElement(_el)) {
    _clone_calc_size(_el)
  }
  return { width, height }
}

//??????????????????????????????????????????x???y????????????????????????true
export function hasScrollbar(el: HTMLElement) {
  const x = getStyle(el, 'overflow-x')
  const y = getStyle(el, 'overflow-y')

  if (x === 'hidden' && y === 'hidden') {
    return { x: false, y: false }
  }

  return {
    x: el.clientWidth < el.scrollWidth,
    y: el.clientHeight < el.scrollHeight
  }
}

//?????????document.body
export function getParentScrollElement(el: any) {
  let _el = getElement(el)
  // console.log(_el, typeof el === 'object')
  // if (!_el && typeof el === 'object') {
  //   _el = el.$el
  // }
  const scrolls: HTMLElement[] = []
  const collectParent = (node: HTMLElement) => {
    const parent = node.parentNode
    if (parent !== null && parent !== doc.body) {
      const _p = parent as HTMLElement
      const { x, y } = hasScrollbar(_p)
      if (x || y) {
        scrolls.push(_p)
      }
      collectParent(_p)
    }
  }
  if (_el && isElement(_el)) {
    collectParent(_el)
  }
  return scrolls
}

export function hasClass(el: any, className: string): boolean {
  const _el = getElement(el)
  if (!className) {
    return false
  }
  if (_el && isElement(_el)) {
    return _el?.classList.contains(className)
  }
  return false
}

export function addClass(el: any, className: string | string[]): void {
  const _el = getElement(el)
  const cls: string[] = isString(className) ? [className] : className
  if (_el && isElement(_el)) _el.classList.add(...cls)
}

export function removeClass(el: any, className: string | string[]): void {
  const _el = getElement(el)
  const cls: string[] = isString(className) ? [className] : className
  if (_el && isElement(_el)) _el.classList.remove(...cls)
}

//attrs???context??????attrs
export function filterListeners(attrs: any) {
  let o: any = {}
  if (attrs) {
    for (const k in attrs) {
      const _on = k.slice(0, 2).toLowerCase()
      if (_on === 'on') {
        o[k] = attrs[k]
      }
    }
  }
  return o
}
