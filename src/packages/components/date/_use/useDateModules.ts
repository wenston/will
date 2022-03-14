import { onMounted } from 'vue'
import { computed, readonly, ref, unref, watchEffect } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type { DateFormatType } from '../../../config/types'
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
