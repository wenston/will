import type { VNode } from 'vue'
import { defineComponent, computed } from 'vue'
import useDate from '../../use/useDate'

export default defineComponent({
  props: {
    //传入的当前日期
    date: { type: [Number, Date, String] },
    //displayDate是展示的日期
    displayDate: { type: [Number, Date, String] },
    //from和to有值的时候，date和displayDate不要有值。
    from: Number,
    to: Number
  },
  emits: {
    'toggle-year': (year: number) => {
      return year >= 1700
    },
    'get-from-to': (from: number, to: number) => {
      if (from || to) {
        return true
      }
    }
  },
  setup(props, { emit, slots }) {
    const {
      format,
      isSameMonth,
      month,
      year,
      getYearsInPanel,
      yearPanelLength
    } = useDate(computed(() => props.displayDate))
    const { year: selectedYear } = useDate(computed(() => props.date))

    const list = computed(() => {
      if (props.from && props.to) {
        const a = Array.from(
          { length: yearPanelLength },
          (item, index) => index + props.from!
        )
        return a
      }
      return []
    })

    function renderYearList() {
      const { years: yearList, from, to } = getYearsInPanel()
      emit('get-from-to', props.from || from, props.to || to)
      let ms: VNode[] = []
      // console.log(list.value, yearList, from, to)
      for (const v of list.value.length ? list.value : yearList) {
        const isCur =
          props.date === undefined ? false : selectedYear.value === v
        const p = {
          class: ['w-months-item', { 'w-months-item-current': isCur }],
          onClick: () => {
            emit('toggle-year', v)
          }
        }
        ms.push(<div {...p}>{v}</div>)
      }
      return <div class="w-months">{ms}</div>
    }
    return renderYearList
  }
})
