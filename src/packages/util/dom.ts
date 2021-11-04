import { isRef, unref, isReactive } from 'vue'
import type { EmptyObject, RectType } from '../config/types'
const doc = document
const objectToString: (v: unknown) => string = Object.prototype.toString
export const transitionState: string[] = [
  'enter-from',
  'enter-active',
  'leave-to',
  'leave-active'
]

function isElement(v: any) {
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
function isDocumentBody(str: any) {
  return str === 'body' || str === document.body
}
export const isString = (val: unknown): val is string => typeof val === 'string'
export const isNumber = (val: unknown): val is number => typeof val === 'number'
export const isObject = (val: unknown): val is Record<any, any> =>
  objectToString(val) === '[object Object]'
export const isFunction = (val: unknown): val is Function =>
  typeof val === 'function'
export const isArray = (val: unknown): val is any[] => Array.isArray(val)
export const isSet = (val: unknown): val is Set<any> => val instanceof Set
export const isMap = (val: unknown): val is Map<any, any> => val instanceof Map
export function isInvalidValue(v: any) {
  return v === '' || v === undefined || v === null || isNaN(v)
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
  return window.getComputedStyle(elem, null)[prop]
}

export function isDisplayNone(elem: HTMLElement) {
  return getStyle(elem, 'display') === 'none'
}

export function getPageScroll() {
  return {
    left: window.pageXOffset,
    top: window.pageYOffset
  }
}

export function getBoundingClientRect(elem: any) {
  const _el = getElement(elem)
  return _el.getBoundingClientRect()
}

export function getOffset(elem: HTMLElement) {
  return {
    left: elem.offsetLeft,
    top: elem.offsetTop
  }
}

//获取滚动条的宽度
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

// 获取元素
export function getElement(elem: any): HTMLElement {
  const el = isRef(elem) ? elem.value : elem
  let _: any
  if (el === window) {
    _ = window
  } else if (isElement(el)) {
    _ = el
  } else if (isDocumentBody(el)) {
    _ = document.body
  } else if (isString(el)) {
    if (isId(el) || isClass(el)) {
      _ = $(el)
    }
  } else if (typeof el === 'object') {
    //控制台打印的是Proxy{...}
    const _el = el.$el
    if (isElement(_el)) {
      _ = _el
    }
  }
  return _
}
// export function getElement(el: any) {
//   const v = el
//   let _v: any = undefined
//   let _el = undefined
//   if (isRef(v)) {
//     _v = v.value
//   } else if (isElement(v)) {
//     _v = v
//   }
//   if (_v === window) {
//     _el = _v
//   } else if (isElement(_v)) {
//     _el = _v
//   } else if (isDocumentBody(_v)) {
//     _el = document.body
//   } else if (isString(_v)) {
//     if (isId(_v) || isClass(_v)) {
//       _el = $(_v)
//     }
//   } else if (typeof _v === 'object') {
//     if (_v.$el && isElement(_v.$el)) {
//       _el = _v.$el
//     }
//   } else {
//     try {
//       if (_v) {
//         const _ = _v.$el
//         if (_ && isElement(_)) {
//           _el = _
//         }
//       }
//     } catch (err) {
//       console.error(err)
//     }
//   }
//   return _el
// }

export function getElementPositionInPage(elem: any): RectType {
  let _el = getElement(elem)

  const { left, top } = getPageScroll()
  const rect = getBoundingClientRect(_el)
  // const marginLeft = getStyle(elem,'margin-left')
  // const marginTop=getStyle(elem,'margin-top')
  // console.log(marginLeft,marginTop)
  return {
    left: left + rect.left,
    top: top + rect.top,
    right: rect.right + left,
    bottom: rect.bottom + top,
    width: rect.width,
    height: rect.height
  }
}

//计算不可见元素的宽高
export function getInvisibleElementSize(
  el: any, //要计算的元素
  nearby: boolean = false,
  relate?: any, //相关元素
  transitionName?: string
) {
  let width: number = 0,
    height: number = 0
  function _clone_calc_size(_el: Element) {
    let parentNode = doc.body
    if (nearby) {
      parentNode = getElement(relate)?.parentNode || parentNode
    }
    const node: any = _el.cloneNode(true)
    if (transitionName) {
      removeClass(
        node,
        transitionState.map((s) => transitionName + '-' + s)
      )
    }
    node.style.display = 'block'
    node.style.opacity = '0'
    parentNode.appendChild(node)
    const { width: _w, height: _h } = getBoundingClientRect(node)
    width = _w
    height = _h
    parentNode.removeChild(node)
  }
  _clone_calc_size(getElement(el))
  return { width, height }
}

//判断给定的元素有没有滚动条，x和y任何一个有，即为true
export function hasScrollbar(el: HTMLElement) {
  const x = getStyle(el, 'overflow-x')
  const y = getStyle(el, 'overflow-y')

  if (x === 'hidden' && y === 'hidden') {
    return false
  }

  return el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight
}

//不包括document.body
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
      if (hasScrollbar(_p)) {
        scrolls.push(_p)
      }
      collectParent(_p)
    }
  }
  if (_el) {
    collectParent(_el)
  }
  return scrolls
}

export function hasClass(el: any, className: string): boolean {
  const _el = getElement(el)
  if (!className) {
    return false
  }
  return _el.classList.contains(className)
}

export function addClass(el: any, className: string | string[]): void {
  const _el = getElement(el)
  const cls: string[] = isString(className) ? [className] : className
  _el.classList.add(...cls)
}

export function removeClass(el: any, className: string | string[]): void {
  const _el = getElement(el)
  const cls: string[] = isString(className) ? [className] : className
  _el.classList.remove(...cls)
}

//attrs是context里的attrs
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
