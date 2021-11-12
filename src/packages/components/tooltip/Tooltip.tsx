import { ref, computed, defineComponent } from 'vue'
import Layer from '../layer'

export default defineComponent({
  inheritAttrs: false,
  components: { Layer },
  name: 'Tooltip',
  props: {
    ...Layer.props
  },
  setup(props, { slots, emit, attrs }) {
    const layerOptions = computed(() => {
      const varStyle = {
        '--_layer-border-color': 'transparent',
        '--_layer-background-color': 'rgba(0,0,0,.75)',
        '--_layer-color': 'rgba(255,255,255,.95)',
        '--_layer-arrow-gap': '0px'
      }
      return {
        ...attrs,
        ...props,

        layerVarStyle: varStyle,
        layerClass: ['w-tooltip'],
        transitionName: 'w-translate-x'
      }
    })
    return () => {
      return <Layer {...layerOptions.value} v-slots={slots} />
    }
  }
})
