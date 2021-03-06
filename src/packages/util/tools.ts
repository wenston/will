import { EmptyObject } from '../config/types'
import { isDate as _isDate } from 'date-fns'

export const isBoolean = (val: unknown): val is boolean =>
  typeof val === 'boolean'
export const isString = (val: unknown): val is string => typeof val === 'string'
export const isNumber = (val: unknown): val is number => typeof val === 'number'
export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object'
export const isFunction = (val: unknown): val is Function =>
  typeof val === 'function'
export const isArray = (val: unknown): val is any[] => Array.isArray(val)
export const isSet = (val: unknown): val is Set<any> => val instanceof Set
export const isMap = (val: unknown): val is Map<any, any> => val instanceof Map
export const isDate = _isDate

console.log(isDate(Number(new Date())))
export const isInvalidValue = (v: any) =>
  v === '' || v === undefined || v === null

export const isValidValue = (v: any) => !isInvalidValue(v)
export function getItemValue<T extends number | string>(
  item: any,
  fieldOrIndex?: T
) {
  if (isNumber(item) || isString(item)) {
    return item
  }
  if (fieldOrIndex === undefined) {
    return undefined
  } else {
    if (isObject(item) || isArray(item)) {
      return item[fieldOrIndex]
    }
  }
}
//将树形结构的数据扁平化，支持条件筛选
//如何用ts更规范的定义此函数？
export function plattenTreeData<T extends Record<any, any>>(
  data: T[],
  childField: string,
  filter?: (parentItem: any, currentItem: any) => boolean,
  parentItem?: T | null
) {
  let filterPlattenData: T[] = []
  let totalPlattenData: T[] = []

  const fn = (
    data: T[],
    childField: string,
    filter?: (parentItem: any, currentItem: any) => boolean,
    parentItem?: T | null
  ) => {
    if (data?.length) {
      data.forEach((item: T) => {
        totalPlattenData.push(item)
        if (filter) {
          const b = filter(parentItem, item)
          if (b) {
            filterPlattenData.push(item)
          }
        } else {
          filterPlattenData.push(item)
        }
        const child = item[childField]
        if (child && isArray(child)) {
          fn(child, childField, filter, item)
        }
      })
    }
  }

  fn(data, childField, filter, parentItem)

  return {
    filterPlattenData,
    totalPlattenData
  }
}
