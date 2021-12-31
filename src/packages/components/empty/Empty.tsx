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
      default: '24px'
    },
    show: { type: Boolean, default: false },
    text: { type: String, default: '暂无相关数据' },
    hasTransition: { type: Boolean, default: true },
    transitionName: { type: String, default: 'w-scale' }
  },
  setup(props, { slots }) {
    const wrapperOptions = computed(() => {
      return {
        class: 'w-empty'
      }
    })
    const iconOptions = computed(() => {
      return {
        name: props.name || 'w-icon-empty',
        color: props.color,
        class: 'w-empty-icon',

        style: {
          '--w-empty-icon-size': props.size
        }
      }
    })
    return () => {
      let comp = withDirectives(
        <div {...wrapperOptions.value}>
          {slots.default?.() ?? (
            <>
              <Icon {...iconOptions.value} />
              {props.text && <div class="w-empty-text">{props.text}</div>}
            </>
          )}
        </div>,
        [[vShow, props.show]]
      )
      if (props.hasTransition) {
        comp = <Transition name={props.transitionName}>{comp}</Transition>
      }
      return comp
    }
  }
})
