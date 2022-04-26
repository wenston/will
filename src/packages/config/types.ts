import { EnumPlacement, EnumBtnType } from './dictionary'
export interface ComponentProps {
  [k: string]: {
    type: any
    default?: any
    [p: string]: any
  }
}
export type RectType = {
  top: number
  bottom: number
  left: number
  right: number
  width: number
  height: number
  [key: string]: number //注释掉之后，Layer.tsx里飘红，为什么？
}
export type PlacementType = keyof typeof EnumPlacement
export type EmptyObject = { [key: string]: any }
export type BtnType = keyof typeof EnumBtnType
export type BtnMode = 'text' | 'line' //line是线条形式的

export type TriggerType = 'hover' | 'click' | 'focus'

export type DataItemType = boolean | number | string | symbol | object

export type ToggleTransformType = 'scale' | 'translate'
export type DateType = number | string | Date | undefined
export type DateFormatType =
  | 'yyyy'
  | 'yyyy-MM'
  | 'yyyy-MM-dd'
  | 'yyyy-MM-dd HH'
  | 'yyyy-MM-dd HH:mm'
  | 'yyyy-MM-dd HH:mm:ss'

export type TimeFormatType = 'HH' | 'HH:mm' | 'HH:mm:ss'
