import { defineComponent, computed } from 'vue'
import Icon from '../icon/index'
export default defineComponent({
  props: {
    //是否要旋转
    rotate: { type: Boolean, default: false },
    //旋转角度
    deg: { type: Number, default: 180 },
    //旋转方向
    direction: { type: String, default: 'x' } //x,y,z
  },
  setup(props, ctx) {
    const iconOptions = computed(() => {
      return {
        name: 'w-icon-arrow-down',
        class: [
          'w-arrow',
          { ['w-arrow-rotate-' + props.direction]: props.rotate }
        ],
        style: {
          '--w-arrow-rotate-deg': props.rotate ? `${props.deg}deg` : 0
        }
      }
    })
    return () => {
      return <Icon {...iconOptions.value} />
    }
  }
})
