// import { defineComponent, computed, inject, provide } from 'vue'
import Wrapper from '../base/ItemWrapper.vue'
import props from './props'
import PListItem from './PListItem'
import './list.css'
export default defineComponent({
  name: 'p-list',
  components: { Wrapper, PListItem },
  props: {
    ...Wrapper.props,
    ...props
  },
  setup(props, ctx) {

    // provide('type', props.type)

    const containerOptions = computed(() => {
      return {
        uid: props.uid,
        class: [' w-cursor-pointer'],
        style: {
          background: props.background
        }
      }
    })
    const tp: any = ref('')
    const itemOptions: any = computed(() => {
      return props.itemOptions
    })
    provide('itemOption', itemOptions.value)
    const data = computed(() => {
      let a = [1, 2]
      let obj = {
        name: '1',
        img: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1113%2F032120114622%2F200321114622-4-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647142450&t=ae3467450148171d766da827a54a7a3b',
        price: '1',
        salesVolume: '1'
      }
      return a.map((item) => {
        return (
          <PListItem
            itemOptions={itemOptions.value}
            tp={tp.value}
            item={obj}></PListItem>
        )
      })
    })

    const listOptions = computed(() => {
      if (props?.type == 'row') {
        tp.value = 'row'
        return {
          class: ['list', 'row']
        }
      } else {
        tp.value = 'column'
        return {
          class: ['list', 'column']
        }
      }
    })
    return () => (
      <Wrapper {...containerOptions.value}>
        <div {...listOptions.value}>{data.value}</div>
      </Wrapper>
    )
  }
})
