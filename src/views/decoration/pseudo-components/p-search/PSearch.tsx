import { defineComponent, computed, inject } from 'vue'
import Wrapper from '../base/ItemWrapper.vue'
import css from './index.module.css'
export default defineComponent({
  name: 'p-search',
  components: { Wrapper },
  props: {
    ...Wrapper.props,
    placeholder: {
      type: String,
      default: '关键字搜索'
    }
  },
  setup(props, ctx) {
    const containerOptions = computed(() => {
      return {
        uid: props.uid,
        class: [css['p-search'], ' w-cursor-pointer']
      }
    })
    return () => {
      return (
        <Wrapper {...containerOptions.value}>
          <input readonly placeholder={props.placeholder} type="text" />
        </Wrapper>
      )
    }
  }
})
