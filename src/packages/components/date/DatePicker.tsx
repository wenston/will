import { defineComponent, ref, computed, watch, Teleport, nextTick } from 'vue'
import useDate from '../../use/useDate'
import Layer from '../layer/index'
import Trigger from '../trigger/index'
import Icon from '../icon/index'
import Days from './Days'
import Transfer from '../transfer/index'
export default defineComponent({
  name: 'DatePicker',
  components: { Layer, Trigger, Icon, Days, Transfer },
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
      day: displayDay
    } = useDate(displayDate)
    const { year, month, day, getMonth, addMonths, format } =
      useDate(displayDate)
    const text = computed(() => {
      if (props.modelValue === undefined) {
        return ''
      }
      return format(props.modelValue)
    })
    const dayList = ref<{ key: string | number }[]>([
      { key: Number(displayDate.value) }
    ])
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
        text: text.value
      }
      return <Trigger {...triggerOptions} />
    }
    function renderContent() {
      const tOption = {
        class: 'w-date-transfer',
        direction: 'y',
        data: dayList.value,
        onAfterEnter: (fn: 'pop' | 'shift') => {
          dayList.value[fn]()
          const item = dayList.value[0]
          if (item) {
            displayDate.value = item.key
          }
        }
      }
      return (
        <Transfer
          {...tOption}
          v-slots={{
            default: ({ item, index }: { item: any; index: number }) => {
              return <Days date={item.key} key={Number(item.key)} />
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
          }}
        />
      )
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
      const a = addMonths(displayDate.value, -1)
      dayList.value.unshift({ key: Number(a) })
    }

    function toNext(next: () => void) {
      next()
      const a = addMonths(displayDate.value)
      dayList.value.push({ key: Number(a) })
    }

    watch(
      () => props.show,
      (b: boolean) => {
        visible.value = b
      }
    )
    watch(visible, (b: boolean) => {
      if (b) {
        if (selectedDate.value) {
          displayDate.value = selectedDate.value
        }
      }
      emit('update:show', b)
    })
    watch(
      () => props.modelValue,
      (d) => {
        selectedDate.value = d
        if (!visible.value && d !== undefined) {
          displayDate.value = d
        }
      }
    )
    watch(selectedDate, (d) => {
      emit('update:modelValue', format(d))
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
