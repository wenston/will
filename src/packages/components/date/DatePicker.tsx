import { defineComponent, ref, computed, watch, nextTick, reactive } from 'vue'
import type { VNode } from 'vue'
import useDate from '../../use/useDate'
import Layer from '../layer/index'
import Trigger from '../trigger/index'
import Icon from '../icon/index'
import Days from './Days'
import Months from './Months'
import Years from './Years'
import Toggle from '../toggle/index'

type DirectionType = 'x' | 'y'
type TransformType = 'scale' | 'translate'
type ViewsType = 'year' | 'month' | 'day'
type DataItemType = { datetype: ViewsType; val: number | string }
export default defineComponent({
  name: 'DatePicker',
  components: { Layer, Trigger, Icon, Days, Months, Years, Toggle },
  props: {
    show: { type: Boolean, default: false },
    clearable: { type: Boolean },
    disabled: { type: Boolean },
    block: Boolean,
    placeholder: { type: [String, Object, Array], default: '请选择日期' },
    modelValue: {
      type: [Number, Date, String],
      default: undefined
    }
  },
  emits: ['update:show', 'update:modelValue'],
  setup(props, { emit, slots, expose }) {
    const ctrlIcon = ref<HTMLElement>()
    const visible = ref(props.show)
    const showIcon = ref(false)
    const toggleComponent = ref<typeof Toggle>()
    const currentView = ref<ViewsType>('day')
    const isUpDown = ref(false)
    const yearPanel = reactive({ from: 0, to: 0 })
    //当前选择的日期
    const selectedDate = ref<string | number | Date | undefined>(
      props.modelValue
    )
    //当前下拉框展示的日期
    const displayDate = ref<string | number | Date>(
      props.modelValue || new Date()
    )
    const {
      addMonths,
      addYears,
      dayMap,
      format,
      year: displayYear,
      yearPanelLength,
      month: displayMonth,
      day: displayDay,
      parse
    } = useDate(displayDate)

    const text = computed(() => {
      if (props.modelValue === undefined) {
        return ''
      }
      return format(props.modelValue)
    })
    const dataList = ref<DataItemType[]>([
      { datetype: 'day', val: Number(displayDate.value) }
    ])

    const barText = computed(() => {
      const y = displayYear.value + ' 年'
      const m = displayMonth.value + ' 月'
      const view = currentView.value
      if (view === 'day') {
        return y + m
      } else if (view === 'month') {
        return y
      } else if (view === 'year') {
        return `${yearPanel.from}-${yearPanel.to}`
      }
    })
    const layerOptions = computed(() => {
      return {
        immediate: true,
        show: visible.value,
        disabled: props.disabled,
        placement: 'bottom-start',
        gap: 2,
        hasArrow: false,
        transitionName: 'w-slide-y',
        layerClass: 'w-date-picker',
        'onUpdate:show': (b: boolean) => {
          visible.value = b
          nextTick(() => {
            showIcon.value = b
          })
        }
      } as Record<any, any>
    })
    function renderTrigger() {
      const triggerOptions = {
        placeholder: props.placeholder,
        disabled: props.disabled,
        block: props.block,
        clearable: props.clearable,
        text: text.value,
        active: visible.value,
        onClear: () => {
          clear()
        }
      }
      return <Trigger {...triggerOptions} />
    }
    function renderWeekTitleList() {
      const days: VNode[] = []
      for (const [k, v] of dayMap) {
        days.push(<b class={['w-week-title-item']}>{v}</b>)
      }
      return <div class="w-week-title">{days}</div>
    }
    function renderContent() {
      const bar = renderControlBar()
      const curView = currentView.value
      const transform: TransformType = isUpDown.value ? 'translate' : 'scale'
      let toggleOptions = {
        ref: toggleComponent,
        class:
          curView === 'day'
            ? 'w-date-days'
            : curView === 'month' || curView === 'year'
            ? 'w-date-months'
            : '',
        dynamic: true,
        data: dataList.value,
        direction: 'y' as DirectionType,
        transform,
        scale: {
          from: 0.8,
          to: 1.8
        }
      }
      return (
        <>
          {bar}
          <Toggle
            {...toggleOptions}
            v-slots={{
              default: ({
                item,
                index
              }: {
                item: DataItemType
                index: number
              }) => {
                if (item.datetype === 'day') {
                  return (
                    <Days
                      date={selectedDate.value}
                      displayDate={item.val}
                      onToggle-day={(stringDate) => {
                        selectedDate.value = stringDate
                        visible.value = false
                      }}
                    />
                  )
                } else if (item.datetype === 'month') {
                  return (
                    <Months
                      date={selectedDate.value}
                      displayDate={displayDate.value}
                      onToggle-month={(toggleDate) => {
                        isUpDown.value = false
                        toggleComponent.value?.next()
                        dataList.value.push({
                          datetype: 'day',
                          val: Number(toggleDate)
                        })
                        currentView.value = 'day'
                        displayDate.value = toggleDate
                        dataList.value.shift()
                      }}
                    />
                  )
                } else {
                  return (
                    <Years
                      from={yearPanel.from}
                      to={yearPanel.to}
                      date={selectedDate.value}
                      displayDate={displayDate.value}
                      onGet-from-to={(from, to) => {
                        yearPanel.from = from
                        yearPanel.to = to
                      }}
                      onToggle-year={(y) => {
                        isUpDown.value = false
                        toggleComponent.value?.next()
                        dataList.value.push({
                          datetype: 'month',
                          val: ''
                        })
                        displayDate.value = new Date(y, 0)
                        currentView.value = 'month'
                        dataList.value.shift()
                      }}
                    />
                  )
                }
              },
              use: () => curView === 'day' && renderWeekTitleList()
            }}
          />
        </>
      )
    }
    function renderControlBar() {
      return (
        <div class="w-date-control-bar" ref={ctrlIcon}>
          <div
            class={[
              currentView.value === 'year'
                ? 'w-date-control-bar-y'
                : 'w-date-control-bar-y-m'
            ]}
            onClick={() => {
              if (currentView.value === 'day') {
                isUpDown.value = false
                // isPrev.value = true
                toggleComponent.value?.prev()
                dataList.value.unshift({
                  datetype: 'month',
                  val: displayMonth.value
                })
                currentView.value = 'month'
                dataList.value.pop()
              } else if (currentView.value === 'month') {
                isUpDown.value = false
                toggleComponent.value?.prev()
                dataList.value.unshift({
                  datetype: 'year',
                  val: displayYear.value
                })
                currentView.value = 'year'
                dataList.value.pop()
                yearPanel.from = 0
                yearPanel.to = 0
              }
            }}
          >
            {barText.value}
          </div>
          <Icon
            name="w-icon-sort-down"
            class="w-date-control-bar-icon"
            rotate={true}
            onClick={() => {
              toPrev()
            }}
          />
          <Icon
            name="w-icon-sort-down"
            class="w-date-control-bar-icon"
            onClick={() => {
              toNext()
            }}
          />
        </div>
      )
    }

    function toPrev() {
      // isPrev.value = true
      isUpDown.value = true
      const view = currentView.value
      if (view === 'day') {
        toggleComponent.value?.prev()
        const a = Number(addMonths(displayDate.value, -1))
        dataList.value.unshift({ datetype: 'day', val: a })
        dataList.value.pop()
        displayDate.value = a
      } else if (view === 'month') {
        toggleComponent.value?.prev()
        const a = Number(addYears(displayDate.value, -1))
        dataList.value.unshift({ datetype: 'month', val: a })
        dataList.value.pop()
        displayDate.value = a
      } else {
        yearPanel.from = yearPanel.from - yearPanelLength
        yearPanel.to = yearPanel.to - yearPanelLength

        toggleComponent.value?.prev()

        dataList.value.unshift({ datetype: 'year', val: Number(new Date()) })
        dataList.value.pop()
      }
    }

    function toNext() {
      // isPrev.value = false
      isUpDown.value = true
      const view = currentView.value
      if (view === 'day') {
        toggleComponent.value?.next()
        const a = Number(addMonths(displayDate.value))
        dataList.value.push({ datetype: 'day', val: a })
        dataList.value.shift()
        displayDate.value = a
      } else if (view === 'month') {
        toggleComponent.value?.next()
        const a = Number(addYears(displayDate.value, 1))
        dataList.value.push({ datetype: 'month', val: a })
        dataList.value.shift()
        displayDate.value = a
      } else {
        yearPanel.from = yearPanel.from + yearPanelLength
        yearPanel.to = yearPanel.to + yearPanelLength

        toggleComponent.value?.next()
        //val是时间戳，以保证每次都会变化，这样动画才会生效！
        dataList.value.push({ datetype: 'year', val: Number(new Date()) })
        dataList.value.shift()
      }
    }

    function clear() {
      // isPrev.value = false
      selectedDate.value = undefined
      displayDate.value = new Date()
      // dayList.value = [{ key: Number(displayDate.value) }]
      dataList.value = [{ datetype: 'day', val: Number(displayDate.value) }]
      currentView.value = 'day'
    }

    watch(
      () => props.show,
      (b: boolean) => {
        visible.value = b
      }
    )
    watch(visible, (b: boolean) => {
      if (b) {
        //每次展示下拉框时，根据当前选中的日期进行初始化
        if (selectedDate.value) {
          displayDate.value = selectedDate.value
          dataList.value = [
            { datetype: 'day', val: format(selectedDate.value) }
          ]
        } else {
          displayDate.value = new Date()
          dataList.value = [{ datetype: 'day', val: Number(new Date()) }]
        }
        currentView.value = 'day'
      }
      emit('update:show', b)
    })
    watch(
      () => props.modelValue,
      (d) => {
        selectedDate.value = d
        if (d !== undefined) {
          displayDate.value = d
        }
      }
    )
    watch(selectedDate, (d) => {
      emit('update:modelValue', d === undefined ? undefined : format(d))
    })
    return () => {
      const layerSlots = {
        trigger: renderTrigger,
        default: renderContent
      }
      return <Layer {...layerOptions.value} v-slots={layerSlots} />
    }
  }
})
