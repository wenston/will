import type { VNode } from 'vue'
import { defineComponent, computed, readonly } from 'vue'
import useDate from '../../use/useDate'
const monthMap = readonly(
  new Map([
    [1, '一月'],
    [2, '二月'],
    [3, '三月'],
    [4, '四月'],
    [5, '五月'],
    [6, '六月'],
    [7, '七月'],
    [8, '八月'],
    [9, '九月'],
    [10, '十月'],
    [11, '十一月'],
    [12, '十二月']
  ])
)
export default defineComponent({
  props: {
    //传入的当前日期
    date: { type: [Number, Date, String] },
    //displayDate是展示的日期
    displayDate: { type: [Number, Date, String] }
  },
  emits: {
    'toggle-month': (yearMonth: Date) => {
      return yearMonth instanceof Date
    }
  },
  setup(props, { emit, slots }) {
    const { format, isSameMonth, month, year } = useDate(
      computed(() => props.displayDate)
    )
    function renderMonthList() {
      let ms: VNode[] = []
      for (const [k, v] of monthMap) {
        const isSelected =
          props.date && isSameMonth(props.date, new Date(year.value, k - 1))
        const isCur = isSameMonth(new Date(), new Date(year.value, k - 1))
        const p = {
          class: [
            'w-months-item',
            {
              'w-months-item-selected': isSelected,
              'w-months-item-current': isCur
            }
          ],
          onClick: () => {
            emit('toggle-month', new Date(year.value, k - 1))
          }
        }
        ms.push(
          <div {...p}>{isCur ? [<span>{v}</span>, <span>本月</span>] : v}</div>
        )
      }
      return <div class="w-months">{ms}</div>
    }
    return renderMonthList
  }
})
