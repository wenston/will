import { defineComponent, ref, computed, watch } from 'vue'
import useDate from '../../use/useDate'
import Layer from '../layer/index'
import Trigger from '../trigger/index'
import Icon from '../icon/index'
import Days from './Days'
export default defineComponent({
  name: 'DatePicker',
  components: { Layer, Trigger, Icon, Days },
  props: {
    show: { type: Boolean, default: false },
    modelValue: { type: [Number, Date, String] }
  },
  emits: ['update:show', 'update:modelValue'],
  setup(props, { emit, slots, expose }) {
    const visible = ref(props.show)
    //当前展示的日期
    const date = ref<string | number | Date | undefined>(props.modelValue)
    const { year, month } = useDate(date)
    const layerOptions = computed(() => {
      return {
        show: visible.value,
        placement: 'bottom-start',
        gap: 2,
        hasArrow: false,
        transitionName: 'w-slide-y',
        layerClass: 'w-date-picker',
        'onUpdate:show': (b: boolean) => {
          visible.value = b
        }
      } as Record<any, any>
    })
    function renderTrigger() {
      return <Trigger />
    }
    function renderContent() {
      return <Days date={date.value} />
    }
    function renderControlBar() {
      return (
        <div class="w-date-control-bar">
          <div class="w-date-control-bar-y-m">
            {year.value}年{month.value}月
          </div>
          <Icon
            name="w-icon-sort-down"
            class="w-date-control-bar-icon"
            rotate={true}
          />
          <Icon name="w-icon-sort-down" class="w-date-control-bar-icon" />
        </div>
      )
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
