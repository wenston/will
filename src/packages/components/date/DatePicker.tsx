import {
  defineComponent,
  ref,
  computed,
  watch,
  Teleport,
  nextTick,
  ComponentPublicInstance,
  Component
} from 'vue'
import type { VNode, ComponentInternalInstance } from 'vue'
import useDate from '../../use/useDate'
import Layer from '../layer/index'
import Trigger from '../trigger/index'
import Icon from '../icon/index'
import Days from './Days'
import Months from './Months'
import Toggle from '../toggle/index'
type DayType = string | number
type DirectionType = 'x' | 'y'
type TransformType = 'scale' | 'translate'
type ViewsType = 'year' | 'month' | 'day'
type DataItemType = { datetype: ViewsType; val: number | string }
export default defineComponent({
  name: 'DatePicker',
  components: { Layer, Trigger, Icon, Days, Months, Toggle },
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
    const daysComponent = ref<typeof Toggle>()
    const toggleComponent = ref<typeof Toggle>()
    const currentView = ref<ViewsType>('day')
    const isUpDown = ref(false)
    const isPrev = ref(false)
    //当前选择的日期
    const selectedDate = ref<string | number | Date | undefined>(
      props.modelValue
    )
    //当前下拉框展示的日期
    const displayDate = ref<string | number | Date>(
      props.modelValue || new Date()
    )
    const {
      addYears,
      dayMap,
      year: displayYear,
      month: displayMonth,
      day: displayDay,
      parse
    } = useDate(displayDate)
    const { year, month, day, getMonth, addMonths, format } =
      useDate(displayDate)
    const text = computed(() => {
      if (props.modelValue === undefined) {
        return ''
      }
      return format(props.modelValue)
    })
    const dayList = ref<DayType[]>([Number(displayDate.value)])
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
      //如何更好的进行类型定义和应用？
      const tOption = {
        ref: daysComponent,
        class: 'w-date-days',
        dynamic: true,
        direction: 'y' as DirectionType,
        data: dayList.value,
        transform: 'translate' as TransformType,
        onAfterEnter: () => {
          // if (dayList.value.length > 1) {
          //   dayList.value[fn]()
          //   const item = dayList.value[0]
          //   if (item) {
          //     displayDate.value = item.key
          //   }
          // }
        }
      }
      const toggleSlots = {
        default: ({
          item,
          index
        }: {
          item: number | string
          index: number
        }) => {
          return (
            <Days
              date={selectedDate.value}
              displayDate={item}
              onToggle-day={(stringDate) => {
                selectedDate.value = stringDate
                visible.value = false
              }}
            />
          )
        }
        // use: ({ prev, next }: { prev: () => void; next: () => void }) => {
        //   if (showIcon.value) {
        //     return (
        //       <Teleport to={ctrlIcon.value}>
        //         <Icon
        //           name="w-icon-sort-down"
        //           class="w-date-control-bar-icon"
        //           rotate={true}
        //           onClick={() => {
        //             toPrev(prev)
        //           }}
        //         />
        //         <Icon
        //           name="w-icon-sort-down"
        //           class="w-date-control-bar-icon"
        //           onClick={() => {
        //             toNext(next)
        //           }}
        //         />
        //       </Teleport>
        //     )
        //   }
        // }
      }
      return <Toggle {...tOption} v-slots={toggleSlots} />
    }
    function renderControlBar() {
      return (
        <div class="w-date-control-bar" ref={ctrlIcon}>
          <div
            class="w-date-control-bar-y-m"
            onClick={() => {
              if (currentView.value === 'day') {
                isUpDown.value = false
                isPrev.value = true
                toggleComponent.value?.prev()
                dataList.value.unshift({
                  datetype: 'month',
                  val: displayMonth.value
                })
                currentView.value = 'month'
                dataList.value.pop()
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
      isPrev.value = true
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
      }
    }

    function toNext() {
      isPrev.value = false
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
      }
    }

    function clear() {
      isPrev.value = false
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
        default: () => {
          const bar = renderControlBar()
          const curView = currentView.value
          const daysView = [renderWeekTitleList(), renderContent()]
          const transform: TransformType = isUpDown.value
            ? 'translate'
            : 'scale'
          let toggleOptions = {
            ref: toggleComponent,
            class:
              curView === 'day'
                ? 'w-date-days'
                : curView === 'month'
                ? 'w-date-months'
                : '',
            dynamic: true,
            data: dataList.value,
            direction: 'y' as DirectionType,
            transform,
            scale: {
              from: 0.75,
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
                            isPrev.value = false
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
                    }
                  },
                  use: () => curView === 'day' && renderWeekTitleList()
                }}
              />
            </>
          )
          /* if (curView === 'day') {
            return [bar, daysView]
          } else if (curView === 'month') {
            return [
              bar,
              <Toggle
                class="w-date-months"
                transform="scale"
                data={['aaa', 'bbb']}
                v-slots={{
                  default: ({
                    prev,
                    next
                  }: {
                    prev: () => void
                    next: () => void
                  }) => {
                    return <Months />
                  }
                }}
              ></Toggle>
            ]
          } */
        }
      }
      return <Layer {...layerOptions.value} v-slots={layerSlots} />
    }
  }
})
