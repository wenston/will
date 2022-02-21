import type { Ref, ComputedRef } from 'vue'
import { ref, watch } from 'vue'
import { isObject } from '../util'

/**
 * useSearch
 * @param sourceData 源数据
 * @param searchText 搜索关键字
 * @param dontSearch 搜索开关，如果传入true，则不会搜索
 * @param textField 搜索匹配字段
 * @param afterSearch 搜索之后触发回调
 * @returns 返回搜索后的数据
 */
export default function useSearch<T>(
  sourceData: Ref<T[]> | ComputedRef<T[]>,
  searchText: Ref<string>,
  dontSearch: Ref<boolean>,
  textField?: string,
  afterSearch?: (
    resultLength: number,
    isFullData: boolean,
    isEqual?: boolean,
    index?: number
  ) => void
) {
  const filterData = ref<T[]>([]) as Ref<T[]>
  function toSearch(t: string | undefined) {
    if (dontSearch.value === true) {
      return
    }
    if (typeof t === undefined || (typeof t === 'string' && t === '')) {
      filterData.value = sourceData.value
      // afterSearch && afterSearch(filterData.value.length, true)
    } else {
      let isEqual = false
      let i = 0
      const len = sourceData.value.length
      while (i < len) {
        const item = sourceData.value[i]
        const itemType = typeof item
        let currentRowText: T | undefined
        if (itemType === 'string' || itemType === 'number') {
          currentRowText = item
        } else {
          if (
            textField === undefined ||
            textField === '' ||
            textField === null
          ) {
            console.warn('请传入keyField参数')
          } else if (isObject(item)) {
            currentRowText = (item as Record<string, any>)[textField]
          }
        }
        if (currentRowText === t) {
          filterData.value = [item]
          isEqual = true
          break
        } else {
          const ts = (t + '').split(/\s+/g)
          filterData.value = sourceData.value.filter(
            (d: Record<string, any>) => {
              const txt = d[textField!]
              return ts.every((v: string) => {
                return txt.indexOf(v) > -1
              })
            }
          )
        }
        i++
      }
      afterSearch && afterSearch(filterData.value.length, false, isEqual, i)
    }
  }
  watch(
    [searchText, sourceData],
    ([t, d]) => {
      toSearch(t)
    },
    { immediate: true }
  )
  return filterData
}
