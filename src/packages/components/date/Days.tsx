import type { VNode } from 'vue'
import { defineComponent, computed } from 'vue'
import useDate from '../../use/useDate'

export default defineComponent({
  name: 'Days',
  props: {
    //传入的日期,可以是具体的某一天，也可以是年月，如：new Date('2022','3')
    date: { type: [Number, Date, String], default: () => new Date() }
  },
  setup(props, { slots }) {
    const { dayMap, getDaysInPanel, isToday } = useDate(
      computed(() => props.date)
    )

    function renderDayItem(days: number[][], isCurrentMonth: boolean = false) {
      return days.map(([y, m, d]) => {
        //注意，js里的月份是从0开始的，所以new Date()里的月份要减1
        const _isToday = isToday(new Date(y, m - 1, d))
        return (
          <div
            title={`${y}-${m}-${d}`}
            class={[
              'w-date-item',
              'w-date-item-day',
              'w-date-item-circle',
              {
                'w-date-item-not-current': !isCurrentMonth,
                'w-date-item-today': _isToday
              }
            ]}
          >
            {_isToday ? [<span>{d}</span>, <span>今日</span>] : d}
          </div>
        )
      })
    }

    function renderDaysList() {
      const { prev, cur, next } = getDaysInPanel()
      return [
        renderDayItem(prev),
        renderDayItem(cur, true),
        renderDayItem(next)
      ]
    }

    function renderWeekTitleList() {
      const days: VNode[] = []
      for (const [k, v] of dayMap) {
        days.push(<b class={['w-date-item']}>{v}</b>)
      }
      return days
    }
    return () => {
      return (
        <div class="w-date-panel">
          <div class={'w-days'}>
            {renderWeekTitleList()}
            {renderDaysList()}
          </div>
        </div>
      )
    }
  }
})
