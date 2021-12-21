import type { PropType } from 'vue'
import { computed, defineComponent, Transition } from 'vue'
import Loading from '../loading/index'
import Empty from '../empty/index'
import type { EmptyComponentProps } from '../empty/type'
import type { LoadingComponentProps } from '../loading/type'
export default defineComponent({
  props: {
    //是否咋加载数据中
    loading: { type: Boolean, default: false },
    //loading组件的相关props
    loadingProps: {
      type: Object as PropType<LoadingComponentProps>,
      default: () => ({})
    },
    //empty组件的相关props
    emptyProps: {
      type: Object as PropType<EmptyComponentProps>,
      default: () => ({})
    }
  },
  setup(props, { slots }) {
    const loadingOptions = computed(() => {
      return {
        ...props.loadingProps,
        hasTransition: false,
        show: true
      }
    })
    const emptyOptions = computed(() => {
      return {
        ...props.emptyProps,
        hasTransition: false,
        show: true
      }
    })
    return () => {
      const loadingComp = (
        <Loading
          v-slots={{ default: slots.loading }}
          {...loadingOptions.value}
        />
      )
      const emptyComp = (
        <Empty v-slots={{ default: slots.empty }} {...emptyOptions.value} />
      )
      return (
        <Transition name="w-scale" mode="out-in">
          {props.loading ? loadingComp : emptyComp}
        </Transition>
      )
    }
  }
})