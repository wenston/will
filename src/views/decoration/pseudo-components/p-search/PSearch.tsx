import { defineComponent, computed, inject } from 'vue'
import Wrapper from '../base/ItemWrapper.vue'
import props from './props'
import css from './index.module.css'
import Icon from 'will-ui/components/icon/index'
import Dragover from 'will-ui/components/dragover/index'
import DragoverItem from 'will-ui/components/dragoverItem/index'
export default defineComponent({
  name: 'p-search',
  components: { Wrapper, Dragover, DragoverItem },
  props: {
    ...Wrapper.props,
    ...props
  },
  setup(props, ctx) {
    const containerOptions = computed(() => {
      return {
        uid: props.uid,
        class: [css['p-search'], ' w-cursor-pointer'],
        style: {
          background: props.background
        }
      }
    })
    const inputOptions = computed(() => {
      return {
        readonly: true,
        placeholder: props.placeholder,
        type: 'text',
        style: {
          backgroundColor: props.inputBackground
        }
      }
    })
    return () => {
      return (
        <Wrapper {...containerOptions.value}>
          <input {...inputOptions.value} />
          {props.icon && <Icon class={css.icon} name={props.icon} />}
        </Wrapper>
      )
    }
  }
})
