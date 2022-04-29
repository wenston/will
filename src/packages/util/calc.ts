import { unref } from 'vue'
import type {
  AdjustmentPosition,
  RectType,
  PlacementType
} from '../config/types'
import { getBoundingClientRect } from './dom'
import { getWindowSize, getPageScroll, getPageSize } from './dom'
import { EnumPlacement } from '../config/dictionary'
let Placements = Object.values(EnumPlacement)
//简单解决计算出现的精度问题
export const resolveAccuracy = (v: number) => Number(v.toFixed(8))
//计算器，可以使用柯里化！待优化
export const calculator = {
  add: (...items: number[]) => {
    return resolveAccuracy(items.reduce((x, y) => x + y, 0))
  }
}
interface PlacementOptions {
  readonly triggerRect: RectType //触发者的位置大小
  readonly layerSize: { width: number; height: number } //弹出层的宽高
  readonly adjustPosition: AdjustmentPosition
  readonly placement?: PlacementType
  readonly gap?: number
  readonly offset?: { x: number; y: number }
  readonly arrowOffset?: { x: number; y: number }
  readonly layer?: any
}
//双盒定位，包含了位置的自动调整功能
export function getPlacement({
  triggerRect,
  layerSize,
  placement = 'bottom',
  adjustPosition = 'auto',
  gap = 0,
  offset = { x: 0, y: 0 },
  arrowOffset = { x: 0, y: 0 },
  layer
}: PlacementOptions) {
  const badPlacement: Set<PlacementType> = new Set()
  badPlacement.add('center').add('client-center')

  function _calc(plc?: PlacementType) {
    const arrowSize = 3
    const per = 0.25 //箭头位置
    const limit = 18
    const r = triggerRect
    const l = layerSize
    const p = plc || placement

    //top和left是弹出层位置，
    // 注意：x和y是动画起点，即：transform-origin对应的坐标
    // x,y同时也是箭头的位置，所以，x和y是相对于弹出层的位置！！

    const minWidth = Math.min(r.width, l.width)
    const minHeight = Math.min(r.height, l.height)
    switch (p) {
      case 'center':
        place.top = r.top + r.height / 2 - l.height / 2
        place.left = r.left + r.width / 2 - l.width / 2
        break
      case 'client-center':
        const { inner } = getWindowSize()
        const { x, y } = getPageScroll()
        const _layer = unref(layer)
        if (_layer) {
          const rect = getBoundingClientRect(layer)
          if (rect) {
            l.width = rect.width
            l.height = rect.height
          }
        }

        place.top = inner.height / 2 - l.height / 2
        place.left = inner.width / 2 - l.width / 2
        place.top = place.top < 0 ? 0 : place.top
        place.left = place.left < 0 ? 0 : place.left
        //由于client-center是相对于视口定位的，所以如果出现了滚动条，则要减去！
        if (r.width === 0 || r.height === 0) {
          place.x = l.width / 2
          place.y = l.height / 2
        } else {
          place.x = r.left + r.width / 2 - place.left - x
          place.y = r.top + r.height / 2 - place.top - y
        }
        break
      case 'top':
        place.top = r.top - l.height - gap
        place.left = r.left + r.width / 2 - l.width / 2
        place.x = l.width * 0.5 - arrowSize
        place.y = l.height
        break
      case 'top-start':
        place.top = r.top - l.height - gap
        place.left = r.left
        place.x = minWidth * per - arrowSize
        place.y = l.height
        break
      case 'top-end':
        place.top = r.top - l.height - gap
        place.left = r.right - l.width
        place.x = l.width - minWidth * per - arrowSize
        place.y = l.height
        break
      case 'left':
        place.top = r.top + r.height / 2 - l.height / 2
        place.left = r.left - l.width - gap
        place.x = l.width
        place.y = l.height / 2 - arrowSize
        break
      case 'left-start':
        place.top = r.top
        place.left = r.left - l.width - gap
        place.x = l.width
        place.y = minHeight * per - arrowSize
        break
      case 'left-end':
        place.top = r.bottom - l.height
        place.left = r.left - l.width - gap
        place.x = l.width
        place.y = l.height - minHeight * per - arrowSize
        if (l.height - place.y < limit) {
          place.y = l.height - limit
        }
        break
      case 'right-start':
        place.top = r.top
        place.left = r.right + gap
        place.x = arrowSize * -2
        place.y = minHeight * per - arrowSize
        break
      case 'right':
        place.top = r.top + r.height / 2 - l.height / 2
        place.left = r.right + gap
        place.x = arrowSize * -2
        place.y = l.height / 2 - arrowSize
        break
      case 'right-end':
        place.top = r.bottom - l.height
        place.left = r.right + gap
        place.x = arrowSize * -2
        place.y = l.height - minHeight * per - arrowSize
        if (l.height - place.y < limit) {
          place.y = l.height - limit
        }
        break
      case 'bottom-start':
        place.top = r.bottom + gap
        place.left = r.left
        place.x = minWidth * per - arrowSize
        place.y = arrowSize * -2
        break
      case 'bottom-end':
        place.top = r.bottom + gap
        place.left = r.right - l.width
        place.x = l.width - minWidth * per - arrowSize
        place.y = arrowSize * -2
        break
      case 'bottom':
      default:
        place.top = r.bottom + gap
        place.left = r.left + r.width / 2 - l.width / 2
        place.x = l.width * 0.5 - arrowSize
        place.y = arrowSize * -2
    }

    place.top += offset.y
    place.left += offset.x
    place.x += arrowOffset.x
    place.y += arrowOffset.y

    if (adjustPosition !== 'none') {
      //检测是否超出可视区，并返回调整后的位置信息
      const rect = { top: place.top, left: place.left, ...l }
      const out = isOutOfClient(rect)
      const outOfPage = isOutOfPage(rect)
      if (
        out.x.left < 0 ||
        out.y.top < 0 ||
        out.x.right > 0 ||
        out.y.bottom > 0
      ) {
        if (
          outOfPage.x.left < 0 ||
          outOfPage.y.top < 0 ||
          outOfPage.x.right > 0 ||
          outOfPage.y.bottom > 0
        ) {
          // console.log('既超出了可视区，又超出了整个页面')
          if (adjustPosition === 'auto') {
            badPlacement.add(place.placement)
            if (badPlacement.size === Placements.length) {
              place.placement = 'bottom'
              _calc(place.placement)
            } else {
              // const p = guessSuitablePlacement(place.placement, out.x, out.y)
              const p = get4SizeAndGetwhichPlaceIsBigger(triggerRect)

              if (!badPlacement.has(p)) {
                place.placement = p
                _calc(place.placement)
              } else {
                const otherPlacement = Placements.filter(
                  (p) => !badPlacement.has(p as PlacementType)
                ) as PlacementType[]
                place.placement = otherPlacement[0]
                _calc(place.placement)
              }
            }
          } else {
            //如果是依某个方位，则计算出相对比较大的空间位置：start，end
            const direction = getBiggerDirectionByPlace(
              adjustPosition,
              triggerRect
            )

            place.placement = direction

            _calc(place.placement)
          }
        }
      }
    }

    // _adjustPlace(out.x, out.y)
  }
  //place中的placement是调整后的位置
  const place = { top: 0, left: 0, x: 0, y: 0, placement }

  _calc()

  return place
}

//给定一个元素的宽高和距离页面顶部的top和左侧left，计算是否超出了页面
function isOutOfPage(rect: {
  top: number
  left: number
  width: number
  height: number
}) {
  const { width: pageWidth, height: pageHeight } = getPageSize()
  return {
    y: {
      top: rect.top - 0, //小于0则超出顶部
      bottom: rect.top + rect.height - pageHeight //大于0则超出底部
    },
    x: {
      left: rect.left - 0, //小于0则超出左侧
      right: rect.width + rect.left - pageWidth //大于0则超出右侧
    }
  }
}

//给定一个元素的宽高和距离页面顶部的top和左侧left，计算是否超出了可视区
function isOutOfClient(rect: {
  top: number
  left: number
  width: number
  height: number
}) {
  const { x: px, y: py } = getPageScroll()
  const { inner } = getWindowSize()
  return {
    x: {
      left: rect.left - px, //小于0则超出左侧
      right: rect.width + rect.left - px - inner.width //大于0则超出右侧
    },
    y: {
      top: rect.top - py, //小于0则超出顶部
      bottom: rect.top + rect.height - py - inner.height //大于0则超出底部
    }
  }
}

function getBiggerDirectionByPlace(
  placement: 'left' | 'right' | 'bottom' | 'top',
  rect: RectType
): PlacementType {
  return get4SizeAndGetwhichPlaceIsBigger(rect, placement)
}

//获取一个元素上下左右的距离，并计算那个方位的空间更大
function get4SizeAndGetwhichPlaceIsBigger(
  rect: RectType,
  direction?: 'left' | 'right' | 'top' | 'bottom'
) {
  let p: PlacementType = 'left'
  const { inner } = getWindowSize()

  const left = rect.left
  const top = rect.top
  const right = inner.width - rect.right
  const bottom = inner.height - rect.bottom
  const maxDirection = Math.max(left, top, bottom, right)
  if (direction) {
    if (direction === 'left') {
      if (Math.abs(top - bottom) < 100) {
        p = 'left'
      } else if (top > bottom) {
        p = 'left-end'
      } else {
        p = 'left-start'
      }
    } else if (direction === 'right') {
      if (Math.abs(top - bottom) < 100) {
        p = 'right'
      } else if (top > bottom) {
        p = 'right-end'
      } else {
        p = 'right-start'
      }
    } else if (direction === 'top') {
      if (Math.abs(left - right) < 100) {
        p = 'top'
      } else if (left > right) {
        p = 'top-end'
      } else {
        p = 'top-start'
      }
    } else {
      if (Math.abs(left - right) < 100) {
        p = 'bottom'
      } else if (left > right) {
        p = 'bottom-end'
      } else {
        p = 'bottom-start'
      }
    }
  } else {
    if (maxDirection === left) {
      if (Math.abs(top - bottom) < 100) {
        p = 'left'
      } else if (top > bottom) {
        p = 'left-end'
      } else {
        p = 'left-start'
      }
    } else if (maxDirection === right) {
      if (Math.abs(top - bottom) < 100) {
        p = 'right'
      } else if (top > bottom) {
        p = 'right-end'
      } else {
        p = 'right-start'
      }
    } else if (maxDirection === top) {
      if (Math.abs(left - right) < 100) {
        p = 'top'
      } else if (left > right) {
        p = 'top-end'
      } else {
        p = 'top-start'
      }
    } else {
      if (Math.abs(left - right) < 100) {
        p = 'bottom'
      } else if (left > right) {
        p = 'bottom-end'
      } else {
        p = 'bottom-start'
      }
    }
  }

  return p
}

function guessSuitablePlacement(
  plc: PlacementType,
  { left, right }: { left: number; right: number },
  { top, bottom }: { top: number; bottom: number }
) {
  let _p = plc
  if (left < 0 || right > 0 || top < 0 || bottom > 0) {
    //超出可视区有8种情况，
    if (left < 0 && top < 0) {
      _p = 'bottom-start'
    } else if (left < 0 && bottom > 0) {
      _p = 'top-start'
    } else if (right > 0 && top < 0) {
      _p = 'bottom-end'
    } else if (right > 0 && bottom > 0) {
      _p = 'top-end'
    } else if (left < 0) {
      if (_p.indexOf('left') > -1) {
        _p = _p.replace('left', 'right') as PlacementType
      } else {
        if (_p.indexOf('-') > -1) {
          const [p] = _p.split('-')
          _p = (p + '-start') as PlacementType
        } else {
          _p = (_p + '-start') as PlacementType
        }
      }
    } else if (right > 0) {
      if (_p.indexOf('right') > -1) {
        _p = _p.replace('right', 'left') as PlacementType
      } else {
        if (_p.indexOf('-') > -1) {
          const [p] = _p.split('-')
          _p = (p + '-end') as PlacementType
        } else {
          _p = (_p + '-end') as PlacementType
        }
      }
    } else if (top < 0) {
      if (_p.indexOf('top') > -1) {
        _p = _p.replace('top', 'bottom') as PlacementType
      } else {
        if (_p.indexOf('-') > -1) {
          const [p] = _p.split('-')
          _p = (p + '-start') as PlacementType
        } else {
          _p = (_p + '-start') as PlacementType
        }
      }
    } else if (bottom > 0) {
      if (_p.indexOf('bottom') > -1) {
        _p = _p.replace('bottom', 'top') as PlacementType
      } else {
        if (_p.indexOf('-') > -1) {
          const [p] = _p.split('-')
          _p = (p + '-end') as PlacementType
        } else {
          _p = (_p + '-end') as PlacementType
        }
      }
    }
  }
  return _p
}
