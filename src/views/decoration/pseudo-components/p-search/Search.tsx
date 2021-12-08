import { defineComponent, computed, inject } from 'vue'
import Wrapper from '../base/ItemWrapper.vue'
import './index.css'
export default defineComponent({
  name: 'p-search',
  components: { Wrapper },
  props: {
    ...Wrapper.props,
    placeholder: {
      type: String,
      default: '关键字搜索'
    },
    __id: String
  },
  setup(props, ctx) {
    const currentComponent = inject('currentComponent') as Record<any, any>
    const setCurrentComponent = inject('setCurrentComponent') as (
      __id: string
    ) => void
    const containerOptions = computed(() => {
      return {
        class: 'p-search w-cursor-pointer',
        isActive: props.__id == currentComponent.value.__id,
        onClick: () => {
          console.log(props.__id)
          setCurrentComponent(props.__id)
        }
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
