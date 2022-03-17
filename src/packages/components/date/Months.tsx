import type { VNode, PropType } from 'vue'
import type { DateType } from '../../config/types'
import { defineComponent, computed, readonly, FunctionalComponent } from 'vue'
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

// interface Props {
//   date: DateType
//   displayDate: DateType
// }

// type Emit = {
//   'toggle-month': (yearMonth: Date) => void
// }

// const Months: FunctionalComponent<Props, Emit> = (props, ctx) => {
//   const { emit } = ctx
//   const { isSameMonth, year } = useDate(computed(() => props.displayDate))
//   return (() => {
//     let ms: VNode[] = []
//     for (const [k, v] of monthMap) {
//       const isSelected =
//         props.date && isSameMonth(props.date, new Date(year.value, k - 1))
//       const isCur = isSameMonth(new Date(), new Date(year.value, k - 1))
//       const p = {
//         class: [
//           'w-months-item',
//           {
//             'w-months-item-selected': isSelected,
//             'w-months-item-current': isCur
//           }
//         ],
//         onClick: () => {
//           emit('toggle-month', new Date(year.value, k - 1))
//         }
//       }
//       ms.push(
//         <div {...p}>{isCur ? [<span>{v}</span>, <span>本月</span>] : v}</div>
//       )
//     }
//     return <div class="w-months">{ms}</div>
//   })()
// }
// Months.emits = ['toggle-month']
// export default Months
export default defineComponent({
  name: 'Months',
  props: {
    //传入的当前日期
    date: { type: [Date, String, Number] },
    //displayDate是展示的日期
    displayDate: { type: [Date, String, Number] },
    max: { type: [Number, Date, String] },
    min: { type: [Number, Date, String] }
  },
  emits: {
    'toggle-month': (yearMonth: Date) => {
      return yearMonth instanceof Date
    }
  },
  setup(props, { emit, slots }) {
    const { isSameMonth, year, isMinMonthThanDate, isMaxMonthThanDate } =
      useDate(computed(() => props.displayDate))
    function compareDate(d: Date) {
      const min = props.min,
        max = props.max
      if (min || max) {
        let isMin = false,
          isMax = false
        if (min) {
          isMin = isMinMonthThanDate(d, min)
        }
        if (max) {
          isMax = isMaxMonthThanDate(d, max)
        }
        return isMin || isMax
      }
      return false
    }
    function renderMonthList() {
      let ms: VNode[] = []
      for (const [k, v] of monthMap) {
        const isSelected =
          props.date && isSameMonth(props.date, new Date(year.value, k - 1))
        const isCur = isSameMonth(new Date(), new Date(year.value, k - 1))
        const isDisabled = compareDate(new Date(year.value, k - 1))
        const p = {
          class: [
            'w-months-item',
            {
              'w-months-item-selected': isSelected,
              'w-months-item-current': isCur,
              'w-months-item-disabled': isDisabled
            }
          ],
          onClick: () => {
            if (isDisabled) {
              return
            }
            const d = new Date(year.value, k - 1)
            emit('toggle-month', d)
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
