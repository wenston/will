import { SetupContext, PropType, nextTick } from 'vue'
import { watch } from 'vue'
import { TransitionGroup } from 'vue'
import { defineComponent, ref, mergeProps, computed, onMounted } from 'vue'
import useDelay from '../../use/useDelay'

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
  setup(props, { slots, emit, expose, attrs }: SetupContext) {
    const { delay } = useDelay()
    const root = ref<HTMLElement>()
    const isMounted = ref(false)
    const loopIndex = ref(0)
    const willChangeIndex = ref(0)
    const copyData = ref(
      props.data.length ? props.data.filter((item, index) => index === 0) : []
    )
    //展示的当前数据
    const currentData = computed(() => {
      if (props.type === 'loop') {
        return copyData.value
      }
      return props.data
    })

    const place = ref<PlaceType>('unshift')
    const options = computed(() => {
      return mergeProps(
        {
          ref: root,
          class: [
            'w-transfer',
            `w-transfer-${props.direction}`,
            `w-transfer-${place.value}`,
            {
              'w-overflow-hidden': isMounted.value
            }
          ]
        },
        attrs
      )
    })

    function afterTransition() {
      if (props.type === 'dynamic') {
        emit('afterEnter', EFn[place.value])
      } else {
        copyData.value[EFn[place.value]]()
        loopIndex.value = willChangeIndex.value
      }
      // removeClass(root.value, 'w-overflow-hidden')
    }
    function prev() {
      if (props.type === 'dynamic') {
        place.value = 'unshift'
      } else {
        place.value = 'unshift'
        const prevIndex = (loopIndex.value + 1) % props.data.length
        const item = props.data.filter((el, index) => index === prevIndex)[0]

        willChangeIndex.value = prevIndex
        if (item) copyData.value.unshift(item)
      }
    }
    function next() {
      if (props.type === 'dynamic') {
        place.value = 'push'
      } else {
        place.value = 'push'
        const nextIndex = (loopIndex.value + 1) % props.data.length
        const item = props.data.filter((el, index) => index === nextIndex)[0]
        willChangeIndex.value = nextIndex
        if (item) copyData.value.push(item)
      }
    }
    //如果出现了数据变动，则把源数据和现在展示的当前数据进行比对，
    //如果已经有了，则更新数据，如果没有或者出现了全部更新的情况，则重新赋值
    function compareData(newData: DataItemType[]) {
      if (newData.length === 0) {
        copyData.value = []
      } else {
        if (copyData.value.length === 0) {
          copyData.value = newData.slice(0, 1)
        } else {
          const currentKey = copyData.value[0].key
          if (newData.some((item) => item.key === currentKey)) {
            copyData.value = newData.filter((item) => item.key === currentKey)
          } else {
            copyData.value = newData.slice(0, 1)
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

    onMounted(async () => {
      //为什么要这样？
      //根元素上有overflow时，在Layer组件下，下拉会出现空白和抖动！
      //为什么会抖动？
      await delay()
      isMounted.value = true
    })

    return () => {
      const items = currentData.value.map((item, index) => {
        return (
          <div class="w-transfer-item" key={item.key}>
            {slots.default?.({ item, index })}
          </div>
        )
      })
      return (
        <>
          {slots.use?.({ prev, next })}
          <div {...options.value}>
            <TransitionGroup
              name={items.length <= 1 ? '' : 'w-transfer-list'}
              onAfterEnter={afterTransition}
            >
              {items}
            </TransitionGroup>
          </div>
        </>
      )
    }
  }
})
export default TRANSFER
