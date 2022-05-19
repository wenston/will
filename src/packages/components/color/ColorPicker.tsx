import { defineComponent, computed } from 'vue'
import Layer from '../layer/index'
import Trigger from '../trigger/index'
import Slider from '../slider/index'
export default defineComponent({
  components: { Layer, Trigger, Slider },
  props: {
    modelValue: String,
    placeholder: { type: String, default: '取色' },
    disabled: Boolean,
    clearable: Boolean
  },
  setup(props, { emit }) {
    const layerOptions = computed(() => {
      return {
        gap: 2,
        hasArrow: false,
        placement: 'bottom-start',
        transitionName: 'w-slide-y'
      } as Record<string, any>
    })
    return () => {
      return (
        <Layer {...layerOptions.value}>
          {{
            trigger() {
              const triggerOptions = {
                placeholder: props.placeholder,
                disabled: props.disabled,
                clearable: props.clearable
              }
              return <Trigger {...triggerOptions} />
            },
            default() {
              return (
                <div class="w-color-picker">
                  <div class="w-color-panel"></div>
                  <Slider
                    class="w-color-hue-slider"
                    fill={false}
                    show-tooltip={false}
                    min={0}
                    max={359}></Slider>
                </div>
              )
            }
          }}
        </Layer>
      )
    }
  }
})