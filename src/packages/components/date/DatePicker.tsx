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
    modelValue: {
      type: [Number, Date, String],
      default: () => new Date(2021, 10)
    }
  },
  emits: ['update:show', 'update:modelValue'],
  setup(props, { emit, slots, expose }) {
    const ctrlIcon = ref<HTMLElement>()
    const visible = ref(props.show)
    const showIcon = ref(false)
    //当前展示的日期
    const date = ref<string | number | Date>(props.modelValue || new Date())
    const { year, month, day, getMonth, addMonths } = useDate(date)
    const dayList = ref<{ key: string | number }[]>([
      { key: Number(date.value) }
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
      return <Trigger />
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
            date.value = item.key
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
            {year.value} 年 {month.value} 月
          </div>
        </div>
      )
    }

    function toPrev(prev: () => void) {
      prev()
      const a = addMonths(date.value, -1)
      dayList.value.unshift({ key: Number(a) })
    }

    function toNext(next: () => void) {
      next()
      const a = addMonths(date.value)
      dayList.value.push({ key: Number(a) })
    }

    watch(
      () => props.show,
      (b: boolean) => {
        visible.value = b
      }
    )
    watch(visible, (b: boolean) => {
      emit('update:show', b)
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
