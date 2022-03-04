import { PropType, watch } from 'vue'
import { TransitionGroup } from 'vue'
import { defineComponent, ref, mergeProps, computed, onMounted } from 'vue'

type DataItemType = {
  key: string | number | symbol
  [k: string | number | symbol]: any
}
type DataChangeType = 'dynamic' | 'loop'
type PlaceType = 'unshift' | 'push'
enum EFn {
  'unshift' = 'pop',
  'push' = 'shift'
}
const TRANSFER = defineComponent({
  inheritAttrs: false,
  components: {},
  name: 'Transfer',
  props: {
    //data数组里的每个对象必须要有key，
    //因为本组件使用了TransitionGroup
    data: { type: Array as PropType<DataItemType[]>, default: () => [] },
    direction: { type: String, default: 'x' },
    //切换类型，dynamic是使用动态数据，即总是使用props.data
    //loop是循环切换，即：源数据基本定型，只是切换展示而已
    type: { type: String as PropType<DataChangeType>, default: 'dynamic' }
  },
  emits: {
    afterEnter: (fn: EFn.unshift | EFn.push) => {
      if (fn !== EFn.unshift && fn !== EFn.push) {
        console.warn('错了？')
        return false
      }
      return true
    }
  },
  setup(props, { slots, emit, expose, attrs }) {
    //type是loop的情况下，只显示一条数据
    const oneData = ref(props.data.length ? props.data.slice(0, 1) : [])
    //展示的当前数据
    const currentData = computed(() => {
      if (props.type === 'loop') {
        return oneData.value
      }
      return props.data
    })

    const place = ref<PlaceType>('unshift')
    const options = computed(() => {
      return mergeProps(
        {
          class: [
            'w-transfer',
            `w-transfer-${props.direction}`,
            `w-transfer-${place.value}`
          ]
        },
        attrs
      )
    })

    function afterTransition() {
      // emit('afterEnter', place.value === 'unshift' ? 'pop' : 'shift')
      emit('afterEnter', EFn[place.value])
    }
    function prev() {
      place.value = 'unshift'
    }
    function next() {
      place.value = 'push'
    }
    //如果出现了数据变动，则把源数据和现在展示的当前数据进行比对，
    //如果已经有了，则更新数据，如果没有或者出现了全部更新的情况，则重新赋值
    function compareData(newData: DataItemType[]) {
      if (newData.length === 0) {
        oneData.value = []
      } else {
        if (oneData.value.length === 0) {
          oneData.value = newData.slice(0, 1)
        } else {
          const currentKey = oneData.value[0].key
          if (newData.some((item) => item.key === currentKey)) {
            oneData.value = newData.filter((item) => item.key === currentKey)
          } else {
            oneData.value = newData.slice(0, 1)
          }
        }
      }
    }
    watch(
      () => props.data,
      (d) => {
        compareData(d)
      }
    )
    watch(place, (p) => {
      console.log(p)
    })
    return () => {
      return (
        <>
          {slots.use?.({ prev, next })}
          <div {...options.value}>
            <TransitionGroup
              name="w-transfer-list"
              onAfterEnter={afterTransition}
            >
              {currentData.value.map((item, index) => {
                return (
                  <div class="w-transfer-item" key={item.key}>
                    {slots.default?.({ item, index })}
                  </div>
                )
              })}
            </TransitionGroup>
          </div>
        </>
      )
    }
  }
})
export default TRANSFER
