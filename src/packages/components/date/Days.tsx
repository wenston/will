import { getCurrentInstance, onMounted, VNode } from 'vue'
import { defineComponent, computed, watch } from 'vue'
import useDate from '../../use/useDate'

export default defineComponent({
  name: 'Days',
  props: {
    //传入的日期（选择的日期）,可以是具体的某一天，也可以是年月，如：new Date('2022','3')
    date: { type: [Number, Date, String] },
    //displayDate是展示的日期
    displayDate: { type: [Number, Date, String] }
  },
  emits: {
    'toggle-day': (stringDate: string, date: Date) => {
      return true
    }
  },
  setup(props, { slots, emit }) {
    const {
      day,
      dayMap,
      format,
      getDaysInPanel,
      isSameDay,
      isToday,
      month,
      year
    } = useDate(computed(() => props.displayDate))

    function renderDayItem(days: number[][], isCurrentMonth: boolean = false) {
      return days.map(([y, m, d]) => {
        const itemDate = new Date(y, m - 1, d)
        //注意，js里的月份是从0开始的，所以new Date()里的月份要减1
        const _isToday = isToday(itemDate)
        const _isSelected =
          isSameDay(itemDate, props.date) && props.date !== undefined
        const dOptions = {
          title: `${_isToday ? '今日' : ''}${y}-${m}-${d}`,
          class: [
            'w-date-item',
            'w-date-item-day',
            'w-date-item-circle',
            {
              'w-date-item-not-current': !isCurrentMonth,
              'w-date-item-today': _isToday,
              'w-date-item-selected': _isSelected
            }
          ],
          onClick: (e: MouseEvent) => {
            const ymd = format(itemDate)
            emit('toggle-day', ymd, itemDate)
          }
        }
        return (
          <div {...dOptions}>
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

    onMounted(() => {
      // console.log(getCurrentInstance())
    })
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
