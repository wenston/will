import {
  ref,
  computed,
  defineComponent,
  watch,
  unref,
  mergeProps,
  TransitionGroup,
  onMounted,
  getCurrentInstance,
  Transition
} from 'vue'
import type { PropType, ComputedRef } from 'vue'
import useToggleArray from '../../use/toggle/useToggleArray'
import useDelay from '../../use/useDelay'
import { isObject } from '../../util/index'
import type { DataItemType } from '../../config/types'
type TransformType = 'scale' | 'translate'
export default defineComponent({
  inheritAttrs: false,
  name: 'Toggle',
  props: {
    dynamic: Boolean,
    data: {
      type: Array as PropType<DataItemType[]>,
      default: () => []
    },
    //item和index任给其一
    item: {
      type: String as PropType<DataItemType>
    },
    index: {
      type: Number,
      default: 0
    },
    transform: {
      type: String as PropType<TransformType>,
      default: 'scale'
    },
    //当transform时translate时，direction生效
    direction: {
      type: String as PropType<'x' | 'y'>,
      default: 'x'
    },
    carousel: {
      type: Boolean,
      default: false
    },
    //如果是轮播图的情况，则此参数有效
    duration: {
      type: Number,
      default: 3600
    }
  },
  emits: {
    afterToggle: ({
      prev,
      next,
      delay
    }: {
      prev: () => void
      next: () => void
      delay: (handler?: Function | number, delayTime?: number) => Promise<void>
    }) => {
      return true
    }
  },
  setup(props, { attrs, slots, emit }) {
    const isMounted = ref(false)
    const { delay } = useDelay(props.duration)
    const isPrev = ref(false)
    const {
      prev: _prev,
      next: _next,
      item,
      index
    } = useToggleArray<DataItemType>(computed(() => props.data))
    const name = computed(() => {
      const t = props.transform
      if (t === 'scale') {
        if (isPrev.value) {
          return 'w-toggle-scale-prev'
        }
        return 'w-toggle-scale'
      } else if (t === 'translate') {
        if (props.direction === 'y') {
          if (isPrev.value) {
            return 'w-toggle-translate-y-prev'
          }
          return 'w-toggle-translate-y'
        } else {
          if (isPrev.value) {
            return 'w-toggle-translate-prev'
          }
          return 'w-toggle-translate'
        }
      }
    })
    const klass = computed(() => {
      const t = props.transform
      return ['w-toggle', { 'w-overflow-hidden': isMounted.value }]
    })
    const options = computed(() => {
      return mergeProps(
        {
          class: klass.value
        },
        attrs
      )
    })
    const itemOptions = computed(() => {
      const t = props.transform
      return {
        class: 'w-toggle-item'
      }
    })

    function prev() {
      isPrev.value = true
      _prev()
    }
    function next() {
      isPrev.value = false
      _next()
    }

    function afterToggle() {
      // console.log(el)
      emit('afterToggle', { prev, next, delay })
    }

    onMounted(async () => {
      await delay(200)
      // isMounted.value = true
      if (props.carousel) {
        afterToggle()
      }
    })

    return () => {
      return (
        <>
          {slots.use?.({
            ...props,
            prev,
            next,
            item: unref(item),
            index
          })}
          <div {...options.value}>
            {props.data.map((el, i) => {
              return (
                <Transition name={name.value} onAfterEnter={afterToggle}>
                  {i === index.value && (
                    <div {...itemOptions.value}>
                      {slots.default?.({
                        item: el,
                        index: i,
                        prev,
                        next
                      })}
                    </div>
                  )}
                </Transition>
              )
            })}
          </div>
        </>
      )
    }
  }
})
