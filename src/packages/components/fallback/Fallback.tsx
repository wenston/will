import { defineComponent, Transition } from 'vue'
import Loading from '../loading/index'
import Empty from '../empty/index'
export default defineComponent({
  props: {
    loading: { type: Boolean, default: false }
  },
  setup(props, { slots }) {
    return () => {
      const loadingComp = <Loading has-transition={false} show={true} />
      const emptyComp = <Empty has-transition={false} show={true} />
      return (
        <div>
          <Transition name="w-scale">
            {props.loading ? loadingComp : emptyComp}
          </Transition>
        </div>
      )
    }
  }
})
