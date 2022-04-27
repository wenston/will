import { ref, computed, defineComponent, useAttrs, useSlots } from 'vue'
import Layer, { LayerProps } from '../layer'

export default defineComponent({
  inheritAttrs: false,
  components: { Layer },
  name: 'Tooltip',
  props: {
    ...LayerProps,
    trigger: {
      ...LayerProps.trigger,
      default: 'hover'
    }
  },
  setup(props) {
    const d = 6
    const translate = computed(() => {
      const p = props.placement
      let t = ''
      let gap = '0px'
      if (p.indexOf('left') > -1) {
        t = `translateX(${-1 * d}px)`
        gap = '0px'
      } else if (p.indexOf('right') > -1) {
        t = `translateX(${d}px)`
        gap = '3px'
      } else if (p.indexOf('bottom') > -1) {
        t = `translateY(${d}px)`
        gap = '2px'
      } else if (p.indexOf('top') > -1) {
        t = `translateY(${-1 * d}px)`
      }
      return { t, gap }
    })
    const layerOptions = computed(() => {
      const { t, gap } = translate.value
      const varStyle = {
        '--_layer-border-color': 'transparent',
        '--_layer-background-color': 'rgba(0,0,0,.75)',
        '--_layer-color': 'rgba(255,255,255,.95)',
        '--_layer-arrow-gap': gap,
        '--_layer-transform': t,
        ...props.layerCssVar
      }
      return {
        ...useAttrs(),
        ...props,
        trigger: props.manual ? 'click' : props.trigger,
        layerCssVar: varStyle,
        layerClass: ['w-tooltip'],
        transitionName: 'w-translate'
      }
    })
    return () => {
      return <Layer {...layerOptions.value} v-slots={useSlots()} />
    }
  }
})
