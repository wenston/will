import type { RectType, PlacementType } from '../config/types'
import { getWindowSize, getPageScroll } from './dom'
interface PlacementOptions {
  triggerRect: RectType //触发者的位置大小
  layerSize: { width: number; height: number } //弹出层的宽高
  placement?: PlacementType
  gap?: number
  offset?: { x: number; y: number }
}
//双盒定位
export function getPlacement({
  triggerRect,
  layerSize,
  placement = 'bottom',
  gap = 0,
  offset = { x: 0, y: 0 }
}: PlacementOptions) {
  const arrowSize = 3
  const per = 0.25 //箭头位置
  const limit = 18
  const r = triggerRect
  const l = layerSize
  const p = placement

  //top和left是弹出层位置，
  // 注意：x和y是动画起点，即：transform-origin对应的坐标
  // x,y同时也是箭头的位置，所以，x和y是相对于弹出层的位置！！
  const place = { top: 0, left: 0, x: 0, y: 0 }
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
      place.top = inner.height / 2 - l.height / 2
      place.left = inner.width / 2 - l.width / 2
      //由于client-center是相对于视口定位的，所以如果出现了滚动条，则要减去！
      place.x = r.left + r.width / 2 - place.left - x
      place.y = r.top + r.height / 2 - place.top - y
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
      break
    case 'bottom-end':
      place.top = r.bottom + gap
      place.left = r.right - l.width
      place.x = l.width - minWidth * per - arrowSize
      break
    case 'bottom':
    default:
      place.top = r.bottom + gap
      place.left = r.left + r.width / 2 - l.width / 2
      place.x = l.width * 0.5 - arrowSize
  }
  // if (l.width - place.x < limit) {
  //   place.x = place.x - 10
  // } else if (place.x < limit) {
  //   place.x = limit
  // }

  place.top += offset.y
  place.left += offset.x
  return place
}
