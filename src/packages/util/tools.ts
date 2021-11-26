import { EmptyObject } from '../config/types'

export const isString = (val: unknown): val is string => typeof val === 'string'
export const isNumber = (val: unknown): val is number => typeof val === 'number'
export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object'
export const isFunction = (val: unknown): val is Function =>
  typeof val === 'function'
export const isArray = (val: unknown): val is any[] => Array.isArray(val)
export const isSet = (val: unknown): val is Set<any> => val instanceof Set
export const isMap = (val: unknown): val is Map<any, any> => val instanceof Map
export const isInvalidValue = (v: any) =>
  v === '' || v === undefined || v === null || isNaN(v)

//将树形结构的数据扁平化，支持条件筛选
//如何用ts更规范的定义此函数？
export function plattenTreeNode<T extends Record<any, any>>(
  parentItem: T | null,
  data: T[],
  childField: string,
  filter?: (parentItem: any, op: any) => boolean
): T[] {
  let a: T[] = []
  if (data?.length) {
    data.forEach((item: T) => {
      if (filter) {
        const b = filter(parentItem, item)
        if (b) {
          a.push(item)
        }
      } else {
        a.push(item)
      }
      const child = item[childField]
      if (child && isArray(child)) {
        a = a.concat(plattenTreeNode(item, child, childField, filter))
      }
    })
    return a
  }
  return a
}
