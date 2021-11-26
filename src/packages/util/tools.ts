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
export function plattenTreeNode<T extends EmptyObject>(
  data: T[],
  childField: string,
  filter?: (op: any) => boolean
): T[] {
  let a: T[] = []
  if (data.length) {
    data.forEach((item: T) => {
      if (filter) {
        const b = filter(item)
        if (b) {
          a.push(item)
        }
      } else {
        a.push(item)
      }
      const child = item[childField]
      if (child && isArray(child)) {
        a = a.concat(plattenTreeNode(child, childField, filter))
      }
    })
    return a
  }
  return a
}

//将树形结构扁平化、Map化
export function mapTreeNode<T extends EmptyObject>(
  data: T[],
  keyField: string,
  childField: string
) {
  const map: Map<any, any> = new Map()
  function fn(data: T[]) {
    data.forEach((item) => {
      const _item = { ...item }
      if (_item[childField]) {
        delete _item[childField]
        map.set(item[keyField], {
          children: item[childField]
        })
      }
    })
  }
  fn(data)
  return map
}
