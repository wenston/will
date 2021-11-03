export type RectType = {
  top: number
  bottom: number
  left: number
  right: number
  width: number
  height: number
  [key: string]: number //注释掉之后，Layer.tsx里飘红，为什么？
}
export type PlacementType =
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'center'
export type EmptyObject = { [key: string]: any }
export type BtnType = 'primary' | 'default'
export type BtnMode = 'text' | 'line' //line是线条形式的

export type TriggerType = 'hover' | 'click' | 'focus'
