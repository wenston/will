const objectToString: (v: unknown) => string = Object.prototype.toString
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
export declare const NOOP: () => void
