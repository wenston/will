import { defineComponent, ref, computed, watch, Teleport, nextTick } from 'vue'
import useDate from '../../use/useDate'
import Layer from '../layer/index'
import Trigger from '../trigger/index'
import Icon from '../icon/index'
import Days from './Days'
import Toggle from '../toggle/index'
type DayType = string | number
type DirectionType = 'x' | 'y'
type TransformType = 'scale' | 'translate'
export default defineComponent({
  name: 'DatePicker',
  components: { Layer, Trigger, Icon, Days, Toggle },
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
    //当前选择的日期
    const selectedDate = ref<string | number | Date | undefined>(
      props.modelValue
    )
    //当前下拉框展示的日期
    const displayDate = ref<string | number | Date>(
      props.modelValue || new Date()
    )
    const {
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
    const layerOptions = computed(() => {
      return {
        immediate: true,
        show: visible.value,
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
      //如何更好的进行类型定义和应用？
      const tOption = {
        class: 'w-date-transfer',
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
        },
        use: ({ prev, next }: { prev: () => void; next: () => void }) => {
          if (showIcon.value) {
            return (
              <Teleport to={ctrlIcon.value}>
                <Icon
                  name="w-icon-sort-down"
                  class="w-date-control-bar-icon"
                  rotate={true}
                  onClick={() => {
                    toPrev(prev)
                  }}
                />
                <Icon
                  name="w-icon-sort-down"
                  class="w-date-control-bar-icon"
                  onClick={() => {
                    toNext(next)
                  }}
                />
              </Teleport>
            )
          }
        }
      }
      return <Toggle {...tOption} v-slots={toggleSlots} />
    }
    function renderControlBar() {
      return (
        <div class="w-date-control-bar" ref={ctrlIcon}>
          <div class="w-date-control-bar-y-m">
            {displayYear.value} 年 {displayMonth.value} 月
          </div>
        </div>
      )
    }

    function toPrev(prev: () => void) {
      prev()
      const a = Number(addMonths(displayDate.value, -1))
      dayList.value.unshift(a)
      dayList.value.pop()
      displayDate.value = a
    }

    function toNext(next: () => void) {
      next()
      const a = Number(addMonths(displayDate.value))
      dayList.value.push(a)
      dayList.value.shift()
      displayDate.value = a
    }

    function clear() {
      selectedDate.value = undefined
      displayDate.value = new Date()
      // dayList.value = [{ key: Number(displayDate.value) }]
      dayList.value[0] = Number(displayDate.value)
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
          dayList.value = [format(selectedDate.value)]
        }
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
        default: () => [renderControlBar(), renderContent()]
      }
      return <Layer {...layerOptions.value} v-slots={layerSlots} />
    }
  }
})
