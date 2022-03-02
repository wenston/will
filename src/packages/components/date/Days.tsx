import { defineComponent, computed } from 'vue'
import useDate from '../../use/useDate'

export default defineComponent({
  name: 'Days',
  props: {
    //传入的日期
    date: { type: [Number, Date], default: () => new Date() }
  },
  setup(props, { slots }) {
    const { dayMap, getDaysInPanel, isToday } = useDate(
      computed(() => props.date)
    )

    function renderDayItem(days: number[][], isCurrentMonth: boolean = false) {
      return days.map(([y, m, d]) => {
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
                //注意，js里的月份是从0开始的，所以new Date()里的月份要减1
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

    function renderWeekList() {
      const days: unknown[] = []
      for (const [k, v] of dayMap) {
        days.push(<div class={['w-date-item']}>{v}</div>)
      }
      return days
    }
    return () => {
      return (
        <div class="w-date-panel">
          <div class={'w-days'}>
            {renderWeekList()}
            {renderDaysList()}
          </div>
        </div>
      )
    }
  }
})
