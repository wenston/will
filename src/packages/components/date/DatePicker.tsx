import { defineComponent, ref, computed, watch, nextTick, reactive } from 'vue'
import type { VNode, PropType, Ref } from 'vue'
import type {
  ToggleTransformType,
  DateFormatType,
  TimeFormatType
} from '../../config/types'
import useDate from '../../use/useDate'
import Layer from '../layer/index'
import Trigger from '../trigger/index'
import Icon from '../icon/index'
import Days from './Days'
import Months from './Months'
import Years from './Years'
import Toggle from '../toggle/index'
import Dial from '../time/Dial.vue'
import Btn from '../btn/index'

import {
  useDateView,
  useBarText,
  useDateText,
  useFormatDate
} from './_use/useDateModules'

type DirectionType = 'x' | 'y'
type ViewsType = 'year' | 'month' | 'day' | 'time'
type DataItemType = { datetype: ViewsType; val: number | string }

const renderPrevIcon = (handleClick: () => void) => (
  <Icon
    name="w-icon-sort-down"
    class="w-date-control-bar-icon"
    rotate={true}
    onClick={handleClick}
  />
)

const renderNextIcon = (handleClick: () => void) => (
  <Icon
    name="w-icon-sort-down"
    class="w-date-control-bar-icon"
    onClick={handleClick}
  />
)

const renderWeekTitleList = (dayMap: ReadonlyMap<number, string>) => {
  const days: VNode[] = []
  for (const [k, v] of dayMap) {
    days.push(<b class={['w-week-title-item']}>{v}</b>)
  }
  return <div class="w-week-title">{days}</div>
}

export default defineComponent({
  name: 'DatePicker',
  components: { Layer, Trigger, Icon, Days, Months, Years, Toggle, Dial },
  props: {
    show: { type: Boolean, default: false },
    clearable: { type: Boolean },
    disabled: { type: Boolean },
    block: Boolean,
    placeholder: { type: [String, Object, Array], default: '请选择日期' },
    modelValue: {
      type: [Number, Date, String],
      default: undefined
    },
    format: {
      type: String as PropType<DateFormatType>,
      default: 'yyyy-MM-dd'
      // required: true
    },
    max: { type: [Number, Date, String] },
    min: { type: [Number, Date, String] }
  },
  emits: ['update:show', 'update:modelValue'],
  setup(props, { emit, slots, expose }) {
    const ctrlIcon = ref<HTMLElement>()
    const visible = ref(props.show)
    const showIcon = ref(false)
    const toggleComponent = ref<typeof Toggle>()
    const {
      currentView,
      isYear,
      isDay,
      isMonth,
      isTime,
      formatIsDay,
      formatIsMonth,
      formatIsYear,
      formatIsTime,
      getFormatView,
      setCurrentView
    } = useDateView(computed(() => props.format))

    const isUpDown = ref(false)
    const yearPanel = reactive({ from: 0, to: 0 })
    const { selectedDate, getStringDate, formatDate } = useFormatDate(
      computed(() => props.format),
      computed(() => props.modelValue)
    )
    //当前下拉框展示的日期
    const displayDate = ref(formatDate(props.modelValue) || new Date())
    const {
      addMonths,
      addYears,
      dayMap,
      format,
      year: displayYear,
      yearPanelLength,
      month: displayMonth
    } = useDate(
      displayDate,
      computed(() => props.format)
    )

    const text = useDateText(
      computed(() => props.format),
      computed(() => props.modelValue)
    )
    const timeFormat = computed(() => {
      let f: TimeFormatType = 'HH:mm:ss'
      const _f = props.format
      if (formatIsTime.value) {
        f = _f.split(/\s+/)[1] as TimeFormatType
      }
      return f
    })
    const timeValue = computed(() => {
      if (isTime.value) {
        const d = selectedDate.value
        if (d) {
          const h = d.getHours(),
            m = d.getMinutes(),
            s = d.getSeconds()
          const hh = h.toString().padStart(2, '0')
          const mm = m.toString().padStart(2, '0')
          const ss = s.toString().padStart(2, '0')
          return [hh, mm, ss]
        }
      }
    })

    const dataList = ref<DataItemType[]>([
      { datetype: 'day', val: Number(displayDate.value) }
    ])

    const barText = useBarText(
      isYear,
      isMonth,
      isDay,
      isTime,
      displayDate,
      yearPanel
    )

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

    function renderContent() {
      const bar = renderControlBar()
      const transform: ToggleTransformType = isUpDown.value
        ? 'translate'
        : 'scale'
      let toggleOptions = {
        ref: toggleComponent,
        class:
          isDay.value || isTime.value
            ? 'w-date-days'
            : isMonth.value || isYear.value
            ? 'w-date-months'
            : '',
        dynamic: true,
        data: dataList.value,
        direction: 'y' as DirectionType,
        transform,
        scale: {
          from: 0.75,
          to: 1.8
        },
        onWheel({
          event,
          delay
        }: {
          event: WheelEvent
          delay: (fn: Function, n: number) => void
        }) {
          if (event.deltaY > 0) {
            delay(toNext, 100)
          } else {
            delay(toPrev, 100)
          }
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
                      format={props.format}
                      min={props.min}
                      max={props.max}
                      onToggle-day={(stringDate) => {
                        if (formatIsDay.value) {
                          emit('update:modelValue', stringDate)
                          visible.value = false
                        } else if (formatIsTime.value) {
                          isUpDown.value = false
                          toggleComponent.value?.next()
                          dataList.value.push({
                            datetype: 'time',
                            val: ''
                          })
                          dataList.value.shift()
                          setCurrentView('time')
                          const hms = createTimeByFormat()
                          let sd = stringDate
                          if (hms) {
                            sd = sd + ' ' + hms
                          }
                          // console.log(sd)
                          emit('update:modelValue', sd)
                        }
                      }}
                    />
                  )
                } else if (item.datetype === 'time') {
                  return (
                    <Dial
                      format={timeFormat.value}
                      value={timeValue.value?.join(':')}
                      onChange={(hms) => {
                        const sd = selectedDate.value
                        if (sd) {
                          const d = format(sd, 'yyyy-MM-dd')
                          emit('update:modelValue', d + ' ' + hms)
                        }
                      }}
                    />
                  )
                } else if (item.datetype === 'month') {
                  return (
                    <Months
                      date={selectedDate.value}
                      displayDate={displayDate.value}
                      min={props.min}
                      max={props.max}
                      onToggle-month={(toggleDate) => {
                        if (formatIsDay.value || formatIsTime.value) {
                          isUpDown.value = false
                          toggleComponent.value?.next()
                          dataList.value.push({
                            datetype: 'day',
                            val: Number(toggleDate)
                          })
                          setCurrentView('day')
                          displayDate.value = toggleDate
                          dataList.value.shift()
                        } else if (formatIsMonth.value) {
                          // console.log(getStringDate(toggleDate))
                          emit('update:modelValue', getStringDate(toggleDate))
                          visible.value = false
                        }
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
                      min={props.min}
                      max={props.max}
                      onGet-from-to={(from, to) => {
                        yearPanel.from = from
                        yearPanel.to = to
                      }}
                      onToggle-year={(y) => {
                        if (formatIsYear.value) {
                          emit('update:modelValue', y + '')
                          visible.value = false
                        } else {
                          isUpDown.value = false
                          toggleComponent.value?.next()
                          dataList.value.push({
                            datetype: 'month',
                            val: ''
                          })
                          displayDate.value = new Date(y, 0)
                          setCurrentView('month')
                          dataList.value.shift()
                        }
                      }}
                    />
                  )
                }
              },
              use: () => isDay.value && renderWeekTitleList(dayMap)
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
              isYear.value
                ? 'w-date-control-bar-disabled'
                : 'w-date-control-bar-y-m'
            ]}
            onClick={() => {
              if (isDay.value) {
                isUpDown.value = false
                toggleComponent.value?.prev()
                dataList.value.unshift({
                  datetype: 'month',
                  val: displayMonth.value
                })
                setCurrentView('month')
                dataList.value.pop()
              } else if (isMonth.value) {
                isUpDown.value = false
                toggleComponent.value?.prev()
                dataList.value.unshift({
                  datetype: 'year',
                  val: displayYear.value
                })
                setCurrentView('year')
                dataList.value.pop()
                yearPanel.from = 0
                yearPanel.to = 0
              } else if (isTime.value) {
                isUpDown.value = false
                toggleComponent.value?.prev()
                dataList.value.unshift({
                  datetype: 'day',
                  val: Number(displayDate.value)
                })
                setCurrentView('day')
                dataList.value.pop()
              }
            }}
          >
            {barText.value}
          </div>
          {isTime.value ? (
            <Btn
              mode="text"
              text="确定"
              onClick={() => {
                visible.value = false
              }}
            />
          ) : (
            [renderPrevIcon(toPrev), renderNextIcon(toNext)]
          )}
        </div>
      )
    }

    function createTimeByFormat() {
      const f = timeFormat.value
      const yms = timeValue.value
      if (yms) {
        if (f === 'HH') {
          return yms[0]
        } else if (f === 'HH:mm') {
          return yms.slice(0, 2).join(':')
        } else if (f === 'HH:mm:ss') {
          return yms.join(':')
        }
      }
    }

    function toPrev() {
      // isPrev.value = true
      isUpDown.value = true
      const view = currentView.value
      toggleComponent.value?.prev()
      if (view === 'day') {
        const am = addMonths(displayDate.value, -1)
        dataList.value.unshift({ datetype: view, val: Number(am) })
        dataList.value.pop()
        displayDate.value = am
      } else if (view === 'month') {
        const ay = addYears(displayDate.value, -1)
        const a = Number(ay)
        dataList.value.unshift({ datetype: view, val: a })
        dataList.value.pop()
        displayDate.value = ay
      } else {
        yearPanel.from = yearPanel.from - yearPanelLength
        yearPanel.to = yearPanel.to - yearPanelLength

        dataList.value.unshift({ datetype: view, val: Number(new Date()) })
        dataList.value.pop()
      }
    }

    function toNext() {
      // isPrev.value = false
      isUpDown.value = true
      const view = currentView.value
      toggleComponent.value?.next()
      if (view === 'day') {
        const am = addMonths(displayDate.value)
        const a = Number(am)
        dataList.value.push({ datetype: view, val: a })
        dataList.value.shift()
        displayDate.value = am
      } else if (view === 'month') {
        const ay = addYears(displayDate.value, 1)
        const a = Number(ay)
        dataList.value.push({ datetype: view, val: a })
        dataList.value.shift()
        displayDate.value = ay
      } else {
        yearPanel.from = yearPanel.from + yearPanelLength
        yearPanel.to = yearPanel.to + yearPanelLength
        //val是时间戳，以保证每次都会变化，这样动画才会生效！
        dataList.value.push({ datetype: view, val: Number(new Date()) })
        dataList.value.shift()
      }
    }

    function clear() {
      // 清空时，仍然保持在当前的显示状态
      // displayDate.value = new Date()
      // dataList.value = [{ datetype: 'day', val: Number(displayDate.value) }]
      //setCurrentView('day')
      if (isTime.value) {
        toggleComponent.value?.prev()
        dataList.value.unshift({
          datetype: 'day',
          val: Number(displayDate.value)
        })
        dataList.value.pop()
        setCurrentView('day')
      }
      emit('update:modelValue', undefined)
    }

    watch(
      () => props.show,
      (b: boolean) => {
        visible.value = b
      }
    )
    watch(visible, (b: boolean) => {
      if (b) {
        let fv = getFormatView()
        const _fv = fv === 'time' ? 'day' : fv
        //每次展示下拉框时，根据当前选中的日期进行初始化
        if (selectedDate.value) {
          displayDate.value = selectedDate.value
          dataList.value = [
            { datetype: _fv, val: format(selectedDate.value, props.format) }
          ]
        } else {
          displayDate.value = new Date()
          dataList.value = [{ datetype: _fv, val: Number(new Date()) }]
        }
        //每次显示出下拉框时就会按照format给定的值进行初始化界面

        setCurrentView(_fv)
      }
      emit('update:show', b)
    })
    watch(
      () => props.modelValue,
      (d) => {
        if (d !== undefined) {
          // displayDate.value = d
          displayDate.value = selectedDate.value!
        }
      }
    )

    return () => (
      <Layer {...layerOptions.value}>
        {{
          trigger: renderTrigger,
          default: renderContent
        }}
      </Layer>
    )
  }
})
