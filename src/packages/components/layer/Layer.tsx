/**
 * Layer是弹出层，弹出层的位置根据trigger插槽内容位置来确定，
 * 确定位置的时机，在于事件绑定的类型，即trigger参数，如果是click，即点击时
 * 根据trigger内容当前在页面中的位置计算弹出层的位置
 *
 */
import type { Ref, VNode, PropType } from 'vue'
import { Transition, Teleport } from 'vue'
import { onMounted, onUpdated, onBeforeUnmount } from 'vue'
import {
  defineComponent,
  ref,
  reactive,
  computed,
  watch,
  cloneVNode,
  renderSlot
} from 'vue'
import type {
  TriggerType,
  PlacementType,
  RectType,
  EmptyObject
} from '../../config/types'
import useSlot from '../../use/useSlot'
import useGlobalZIndex from '../../use/useGlobalZIndex'
import useToggleArray from '../../use/toggle/useToggleArray'
import useEvent from '../../use/useEvent'
import {
  isArray,
  getBoundingClientRect,
  getElementPositionInPage,
  getInvisibleElementSize,
  getParentScrollElement
} from '../../util'
import { getPlacement } from '../../util/calc'
//renderSlot和slots[插槽名]两种方式得出的插槽内容的格式不一样！
export default defineComponent({
  name: 'Layer',
  inheritAttrs: false,
  props: {
    show: {
      type: Boolean,
      default: false
    },
    placement: {
      type: String as PropType<PlacementType>,
      default: 'bottom'
    },
    gap: {
      type: Number,
      default: 6
    },
    offset: {
      type: Object as PropType<{ x: number; y: number }>,
      default: () => ({ x: 0, y: 0 })
    },
    //触发弹出层出现的动作（事件）方式
    trigger: {
      type: String as PropType<TriggerType>,
      default: 'hover'
    },
    nearby: {
      type: Boolean,
      default: false
    },
    transitionName: {
      type: String,
      default: 'w-scale'
    }
  },
  emits: ['update:show'],
  setup(props, { slots, emit }) {
    const Win = ref(window)
    let scrollElements: HTMLElement[] = []
    const { zIndex, add } = useGlobalZIndex()
    const triggerRoot = ref(null)
    const defaultRoot = ref<HTMLElement>()
    const triggerRect: RectType = reactive({
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: 0,
      height: 0
    })
    const defaultSize = reactive({ width: 0, height: 0 })
    const {
      toggle,
      set,
      item: visible
    } = useToggleArray([false, true], {
      item: props.show
    })
    const vnode_trigger = useSlot(
      computed(() => renderSlot(slots, 'trigger', { toggle, hide, show })),
      true
    )
    const vnode_default = useSlot(
      computed(() =>
        renderSlot(slots, 'default', {
          toggle,
          hide,
          show
        })
      )
    )
    const defaultProps = computed(() => {
      const { top, left, x, y } = getPlacement({
        triggerRect,
        layerSize: defaultSize,
        placement: props.placement,
        gap: props.gap,
        offset: props.offset
      })
      return {
        ref: defaultRoot,
        class: ['w-layer-content', `w-layer-${props.placement}`],
        style: {
          'z-index': zIndex.value,
          top: `${top}px`,
          left: `${left}px`,
          '--_layer-arrow-x': `${x}px`,
          '--_layer-arrow-y': `${y}px`
        }
      }
    })
    useEvent(triggerRoot, 'click', toggleAndCalc)

    function hide() {
      set({ item: false })
    }
    function show() {
      set({ item: true })
    }

    function toggleAndCalc() {
      if (!visible.value) {
        calc()
      }
      toggle()
    }
    //计算trigger元素的位置大小等信息
    function calc() {
      let rect = getElementPositionInPage(triggerRoot.value!)
      for (const k in rect) {
        triggerRect[k] = rect[k]
      }
      return rect
    }
    //获取default元素尺寸
    function getDefaultRootSize(maybeEl: any) {
      const { width, height } = getInvisibleElementSize(
        maybeEl,
        props.nearby,
        triggerRoot.value,
        props.transitionName
      )
      defaultSize.width = width
      defaultSize.height = height
    }
    //选出有滚动条的父级，绑定滚动事件，在滚动时计算trigger的位置信息
    function getScrollElementAndCalc() {
      if (visible.value && triggerRoot.value) {
        removeEvent(scrollElements, 'scroll', calc)
        scrollElements = getParentScrollElement(triggerRoot.value)
        addEvent(scrollElements, 'scroll', calc)
      }
    }

    onBeforeUnmount(() => {
      removeEvent(scrollElements, 'scroll', calc)
      scrollElements = []
    })
    onMounted(() => {
      if (visible.value) {
        calc()
        getDefaultRootSize(defaultRoot.value)
      }
      getScrollElementAndCalc()
    })
    onUpdated(() => {
      if (visible.value) {
        calc()
        getDefaultRootSize(defaultRoot.value)
      }
      getScrollElementAndCalc()
    })

    watch(visible, (v) => {
      emit('update:show', v)
      if (v) {
        add()
      }
    })
    watch(
      () => props.show,
      (v) => {
        set({ item: v })
      }
    )

    return () => {
      const trigger_content =
        vnode_trigger.value === undefined
          ? undefined
          : cloneVNode(vnode_trigger.value, { ref: triggerRoot })

      let default_content = (
        <Transition
          name={props.transitionName}
          onBeforeEnter={(el) => {
            getDefaultRootSize(el)
          }}>
          {visible.value ? (
            <div {...defaultProps.value}>{vnode_default.value}</div>
          ) : null}
        </Transition>
      )

      if (!props.nearby) {
        default_content = <Teleport to={'body'}>{default_content}</Teleport>
      }

      return (
        <>
          {trigger_content}
          {default_content}
        </>
      )
    }
  }
})

function addEvent(
  el: HTMLElement[] | HTMLElement,
  type: 'scroll' | 'resize',
  fn: () => void
) {
  let arr = isArray(el) ? el : [el]
  arr.forEach((e) => {
    e.addEventListener(type, fn)
  })
}

function removeEvent(
  el: HTMLElement[] | HTMLElement,
  type: 'scroll' | 'resize',
  fn: () => void
) {
  let arr = isArray(el) ? el : [el]
  arr.forEach((e) => {
    e.removeEventListener(type, fn)
  })
}
