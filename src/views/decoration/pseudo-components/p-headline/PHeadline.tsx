import { defineComponent } from 'vue'
import props from './props'
import css from './index.module.css'
import Wrapper from '../base/ItemWrapper.vue'
export default defineComponent({
  components: { Wrapper },
  name: 'p-headline',
  props: {
    ...props,
    ...Wrapper.props
  },
  setup(props) {
    return () => (
      <Wrapper uid={props.uid} class={[css['p-headline']]} style={props.style}>
        {props.text}
      </Wrapper>
    )
  }
})
