import {
  h,
  ref,
  computed,
  defineComponent,
  watch,
  unref,
  mergeProps,
  TransitionGroup,
  onMounted,
  Transition,
  normalizeClass
} from 'vue'
import type { PropType, ComputedRef } from 'vue'
import useToggleArray from '../../use/toggle/useToggleArray'
import useDelay from '../../use/useDelay'
import { isBoolean, isObject } from '../../util/index'
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
    itemClass: { type: [String, Array, Object] },
    transform: {
      type: String as PropType<TransformType>,
      default: 'scale'
    },
    scale: {
      type: Object as PropType<{ from: number; to: number }>,
      default: () => ({ from: 0, to: 2 })
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
    'update:data': null,
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
  setup(props, { attrs, slots, emit, expose }) {
    const isMounted = ref(false)
    const { delay } = useDelay(props.duration)
    const isPrev = ref(false)
    const {
      prev: _prev,
      next: _next,
      item,
      index,
      set
    } = useToggleArray<DataItemType>(computed(() => props.data))
    const name = computed(() => {
      // if (props.data.length <= 1) {
      //   return ''
      // }
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
          class: klass.value,
          style:
            props.transform === 'scale'
              ? {
                  '--__scale-from': props.scale.from,
                  '--__scale-to': props.scale.to
                }
              : null
        },
        attrs
      )
    })
    const itemOptions = computed(() => {
      const t = props.transform
      return mergeProps(
        {
          class: 'w-toggle-item'
        },
        { class: normalizeClass(props.itemClass) }
      )
    })

    function prev() {
      isPrev.value = true
      if (props.dynamic) {
      } else {
        _prev()
      }
    }
    function next() {
      isPrev.value = false
      if (props.dynamic) {
      } else {
        _next()
      }
    }

    function afterToggle() {
      // console.log(el)
      emit('afterToggle', { prev, next, delay })
    }

    expose({
      prev,
      next
    })

    watch(
      () => props.index,
      (i) => {
        if (!props.dynamic) {
          set({ index: props.index })
        }
      },
      { immediate: true }
    )

    onMounted(async () => {
      await delay(200)
      isMounted.value = true
      if (props.carousel) {
        afterToggle()
      }
    })

    return () => {
      const dynamicPart = props.dynamic && (
        <TransitionGroup name={name.value} onAfterEnter={afterToggle}>
          {props.data.map((el, i) => {
            const k = isObject(el)
              ? JSON.stringify(el)
              : isBoolean(el)
              ? Number(el)
              : el
            return (
              <div {...itemOptions.value} key={k}>
                {slots.default?.({
                  item: el,
                  index: i,
                  prev,
                  next
                })}
              </div>
            )
          })}
        </TransitionGroup>
      )
      const staticPart = props.data.map((el, i) => {
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
      })

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
            {props.dynamic ? dynamicPart : staticPart}
          </div>
        </>
      )
    }
  }
})
