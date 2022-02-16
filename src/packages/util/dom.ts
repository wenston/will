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
    //inner的宽高包括了滚动条的尺寸！
    inner: {
      height: win.innerHeight,
      width: win.innerWidth
    }
  }
}
//获取页面的滚动距离
export function getPageScroll() {
  return {
    x: win.pageXOffset,
    y: win.pageYOffset
  }
}

//获取整个页面的宽高
export function getPageSize() {
  return {
    height: Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight),
    width: Math.max(doc.body.scrollWidth, doc.documentElement.scrollWidth)
  }
}

export function getBoundingClientRect(elem: any) {
  const _el = getElement(elem)
  if (_el) {
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
  // const el = isRef(elem) ? elem.value : elem
  const el = unref(elem)
  let _: any
  if (el === window) {
    _ = window
  } else if (el === document) {
    _ = document
  } else if (isElement(el)) {
    _ = el
  } else if (isDocumentBody(el)) {
    _ = document.body
  } else if (isString(el)) {
    if (isId(el) || isClass(el)) {
      _ = $(el)
    }
  } else if (isObject(el)) {
    //控制台打印的是Proxy{...}
    const _el = el.$el
    if (isElement(_el)) {
      _ = _el
    }
  }
  return _
}

export function getElementPositionInPage(elem: any): RectType {
  let _el = getElement(elem)

  const { x: left, y: top } = getPageScroll()
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
    let parentNode: HTMLElement | ParentNode = doc.body
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
    return { x: false, y: false }
  }

  return {
    x: el.clientWidth < el.scrollWidth,
    y: el.clientHeight < el.scrollHeight
  }
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
      const { x, y } = hasScrollbar(_p)
      if (x || y) {
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
