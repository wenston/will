import { onMounted } from 'vue'
import { computed, readonly, ref, unref, watchEffect } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type { DateFormatType, DateType } from '../../../config/types'
import { isString, isNumber, isDate } from '../../../util'
import useDate from '../../../use/useDate'
type DateViewType = 'year' | 'day' | 'month'
enum FormatViewMap {
  'yyyy' = 'year',
  'yyyy-MM' = 'month',
  'yyyy-MM-dd' = 'day'
}
export function useDateView(format: ComputedRef<DateFormatType>) {
  const currentView = ref<DateViewType>('day')
  const currentFormat = computed(() => FormatViewMap[format.value])
  const isYear = computed(() => currentView.value === 'year')
  const isMonth = computed(() => currentView.value === 'month')
  function setCurrentView(view: DateViewType) {
    currentView.value = view
  }

  function toSetByFormat() {
    const f = unref(format)
    setCurrentView(FormatViewMap[f])
  }

  watchEffect(() => {
    // console.log('watchEffect在onMounted之前执行', format.value)
    toSetByFormat()
  })

  return {
    currentView: readonly(currentView),
    isYear,
    isMonth,
    isDay: computed(() => currentView.value === 'day'),
    formatIsYear: computed(() => currentFormat.value === 'year'),
    formatIsMonth: computed(() => currentFormat.value === 'month'),
    formatIsDay: computed(() => currentFormat.value === 'day'),
    getFormatView: () => currentFormat.value,
    setCurrentView
  }
}

export function useBarText(
  isYear: Ref<boolean>,
  isMonth: Ref<boolean>,
  isDay: Ref<boolean>,
  displayDate: Ref<string | number | Date>,
  ft: { from: number; to: number }
) {
  const { year, month } = useDate(displayDate)
  return computed(() => {
    const y = year.value + ' 年'
    const m = month.value + ' 月'
    if (isDay.value) {
      return y + m
    } else if (isMonth.value) {
      return y
    } else if (isYear.value) {
      return `${ft.from}-${ft.to}`
    }
  })
}

/**
 *
 * @param format 日期的格式，如'yyyy-MM-dd'
 * @param theDate 当前选择的日期
 * @returns 返回日期类型的计算属性
 */
export function useFormatDate(
  format: ComputedRef<DateFormatType>,
  theDate: ComputedRef<DateType> //当字符串时，默认时以短横线年月日分割的！
) {
  const { parse, format: _f, year, month, day } = useDate(theDate)

  const selectedDate = computed(() => {
    const f = format.value
    const currentDate = theDate.value
    return formatDate(currentDate)
  })

  function formatDate(date: DateType) {
    if (date !== undefined) {
      //时间戳或者日期对象
      if (isDate(date) || isNumber(date)) {
        return parse(date)
      } else if (isString(date)) {
        const [y, m = 0, d = 1] = date.trim().split('-')
        return parse(new Date(+y, Number(m) - 1, +d))
      }
    }
  }

  return {
    selectedDate,
    formatDate,
    getStringDate: (date: DateType, f?: DateFormatType) => {
      if (date === undefined) {
        return undefined
      } else {
        const _d = formatDate(date)
        // console.log(_d)
        return _f(_d, f || format.value)
      }
    }
  }
}
