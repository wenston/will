import { defineComponent, ref, computed, watch } from 'vue'
import Layer from '../layer/index'
import Trigger from '../trigger/index'
import Days from './Days'
export default defineComponent({
  name: 'DatePicker',
  components: { Layer, Trigger, Days },
  props: {
    show: { type: Boolean, default: false },
    modelValue: { type: [Number, Date, String] }
  },
  emits: ['update:show', 'update:modelValue'],
  setup(props, { emit, slots, expose }) {
    const visible = ref(props.show)
    //当前展示的日期
    const currentDate = ref<string | number | Date | undefined>(
      props.modelValue
    )
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
      return <Days date={currentDate.value} />
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
        default: renderContent
      }
      return <Layer {...layerOptions.value} v-slots={layerSlots} />
    }
  }
})
