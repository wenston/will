import type { RectType, PlacementType } from '../config/types'
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

  //top和left是弹出层位置，x和y是动画起点，即：transform-origin对应的坐标
  //x,y同时也是箭头的位置
  const place = { top: 0, left: 0, x: 0, y: 0 }
  const minWidth = Math.min(r.width, l.width)
  const minHeight = Math.min(r.height, l.height)
  switch (p) {
    case 'left':
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
  if (l.width - place.x < limit) {
    place.x = place.x - 10
  } else if (place.x < limit) {
    place.x = limit
  }

  place.top += offset.y
  place.left += offset.x
  return place
}
