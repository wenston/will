import {
  computed,
  defineComponent,
  Transition,
  vShow,
  withDirectives
} from 'vue'
import Icon from '../icon/index'
export default defineComponent({
  props: {
    ...Icon.props,
    size: {
      type: String,
      default: '15px'
    },
    show: { type: Boolean, default: false },
    text: { type: String, default: '' },
    hasTransition: { type: Boolean, default: true }
  },
  setup(props, ctx) {
    const wrapperOptions = computed(() => {
      return {
        class: 'w-loading'
      }
    })
    const iconOptions = computed(() => {
      return {
        name: props.name || 'w-icon-loading',
        color: props.color,
        class: 'w-loading-icon',

        style: {
          '--w-loading-icon-size': props.size
        }
      }
    })
    return () => {
      let comp = withDirectives(
        <div {...wrapperOptions.value}>
          <Icon {...iconOptions.value} />
          {props.text && <div class="w-loading-text">{props.text}</div>}
        </div>,
        [[vShow, props.show]]
      )
      if (props.hasTransition) {
        comp = <Transition name="w-scale">{comp}</Transition>
      }
      return comp
    }
  }
})
