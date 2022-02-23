import type { PropType } from 'vue'
import { computed } from 'vue'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    name: { type: String as PropType<string> },
    color: String,
    size: String,
    //是否要旋转
    rotate: { type: Boolean, default: false },
    //旋转角度
    deg: { type: Number, default: 180 },
    //旋转方向
    direction: { type: String, default: 'x' } //x,y,z
  },
  setup(props, { slots }) {
    const iconOptions = computed(() => {
      return {
        class: [
          'iconfont',
          'w-icon',
          props.name,
          {
            ['w-icon-rotate-' + props.direction]: props.rotate
          }
        ],
        style: {
          'font-size': props.size,
          color: props.color,
          '--w-icon-rotate-deg': props.rotate ? `${props.deg}deg` : 0
        }
      }
    })
    return () => {
      return <i {...iconOptions.value}>{slots.default?.()}</i>
    }
  }
})
