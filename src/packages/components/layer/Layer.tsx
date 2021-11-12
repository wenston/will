/**
 * Layer是弹出层，弹出层的位置根据trigger插槽内容位置来确定，
 * 确定位置的时机，在于事件绑定的类型，即trigger参数，如果是click，即点击时
 * 根据trigger内容当前在页面中的位置计算弹出层的位置
 *
 */
import type { Ref, PropType, DirectiveArguments } from 'vue'
import { Transition, Teleport } from 'vue'
import { onMounted, onUpdated, onBeforeUnmount } from 'vue'
import { withDirectives, resolveDirective } from 'vue'
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
import useTabIndex from '../../use/useTabIndex'
import useSlot from '../../use/useSlot'
import useGlobalZIndex from '../../use/useGlobalZIndex'
import useToggleArray from '../../use/toggle/useToggleArray'
import useEvent from '../../use/useEvent'
import useDelay from '../../use/useDealy'
import clickOutside from '../../directives/clickOutside'
import Mask from '../mask/'
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
  components: { Mask },
  props: {
    //是否显示
    show: { type: Boolean, default: false },
    //弹出层相对于“trigger”的位置
    placement: { type: String as PropType<PlacementType>, default: 'bottom' },
    //“触发者trigger”和弹出层之间的间距
    gap: { type: Number, default: 6 },
    //弹出层相对于自身的偏移量
    offset: {
      type: Object as PropType<{ x: number; y: number }>,
      default: () => ({ x: 0, y: 0 })
    },
    //触发弹出层出现的动作（事件）方式
    trigger: { type: String as PropType<TriggerType>, default: 'click' },
    //弹出层插入的位置是否紧挨着“触发者trigger”
    nearby: { type: Boolean, default: false },
    canCloseByClickOutside: { type: Boolean, default: true },
    //当canCloseByClickOutside是true时，exclude指明了哪些元素在点击时不关闭弹出层
    exclude: { type: Array as PropType<HTMLElement[]>, default: () => [] },
    transitionName: { type: String, default: 'w-scale' }, //transition过渡动画
    hasArrow: { type: Boolean, default: true }, //弹出层是否有箭头
    hasMask: { type: Boolean, default: false } //是否有遮罩层
  },
  emits: ['update:show'],
  directives: { clickOutside },
  setup(props, { slots, emit }) {
    const Win = window
    let scrollElements: HTMLElement[] = []
    const click_outside = resolveDirective('clickOutside')
    const { delay, stop } = useDelay()
    const { zIndex, add: addZIndex } = useGlobalZIndex()
    const triggerRoot = ref(null)
    const defaultRoot = ref<HTMLElement>()
    //创建一个开关，避免频繁触发onUpdate时频繁计算
    const justNow = ref(false)
    const triggerRect = reactive<RectType>({
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: 0,
      height: 0
    })
    const defaultSize = reactive({ width: 0, height: 0 })
    const placementInfo = reactive({ top: 0, left: 0, x: 0, y: 0 })
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
    const defaultOptions = computed(() => {
      const placement = props.placement
      const pInfo = placementInfo
      return {
        ref: defaultRoot,
        class: [
          'w-layer-content',
          `w-layer-${placement}`,
          {
            'w-layer-no-arrow':
              !props.hasArrow ||
              placement === 'center' ||
              placement === 'client-center'
          }
        ],
        style: {
          'z-index': zIndex.value,
          top: `${pInfo.top}px`,
          left: `${pInfo.left}px`,
          '--_layer-arrow-x': `${pInfo.x}px`,
          '--_layer-arrow-y': `${pInfo.y}px`
        }
      }
    })
    useTriggerType(triggerRoot, props.trigger, handleTriggerEvent)

    useEvent(Win, 'scroll', handleParentScroll)
    useEvent(Win, 'resize', handleParentScroll)
    function hide() {
      set({ item: false })
    }
    function show() {
      set({ item: true })
    }

    function handleTriggerEvent(e: MouseEvent) {
      if (props.trigger === 'hover') {
        if (e.type === 'mouseleave' || e.type === 'mouseout') {
          delay(hide)
        } else if (e.type === 'mouseenter' || e.type === 'mouseover') {
          delay(() => {
            show()
          })
        }
      } else if (props.trigger === 'focus') {
        if (e.type === 'focus') {
          show()
        } else if (e.type === 'blur') {
          hide()
        }
      } else {
        toggle()
      }
    }
    function toGetDefaultPlacement() {
      if (visible.value) {
        const { top, left, x, y } = getPlacement({
          triggerRect,
          layerSize: defaultSize,
          placement: props.placement,
          gap: props.gap,
          offset: props.offset
        })
        placementInfo.top = top
        placementInfo.left = left
        placementInfo.x = x
        placementInfo.y = y
      }
    }
    //计算trigger元素的位置大小等信息，为定位弹出层做准备
    function calcTriggerRect() {
      if (visible.value && triggerRoot.value) {
        let rect = getElementPositionInPage(triggerRoot)
        for (const k in rect) {
          triggerRect[k] = rect[k]
        }
        justNow.value = true
      }
    }
    //获取default元素尺寸，为定位做准备
    function getDefaultRootSize(maybeEl: any) {
      if (visible.value) {
        const { width, height } = getInvisibleElementSize(
          maybeEl,
          props.nearby,
          triggerRoot.value,
          props.transitionName
        )
        defaultSize.width = width
        defaultSize.height = height
      }
    }
    //选出有滚动条的父级，绑定滚动事件，在滚动时计算trigger的位置信息
    function getScrollElementAndCalc() {
      if (visible.value && triggerRoot.value) {
        scrollElements = getParentScrollElement(triggerRoot.value)
        addEvent(scrollElements, 'scroll', handleParentScroll)
      }
    }

    //可滚动的父级如果在滚动时，实时计算trigger本身的位置信息，并获取弹出层最新的定位
    function handleParentScroll() {
      calcTriggerRect()
      toGetDefaultPlacement()
    }

    onBeforeUnmount(() => {
      removeEvent(scrollElements, 'scroll', handleParentScroll)
      scrollElements = []
    })
    onMounted(() => {
      /**
       * 挂载之后就查看是否展示了弹出层，
       *
       */
      //计算trigger元素的位置大小等信息
      calcTriggerRect()
      //计算弹出层的大小
      getDefaultRootSize(defaultRoot.value)
      //根据以上两个方法得出的结果，对弹出层进行定位
      toGetDefaultPlacement()
      //如果弹出层位于某个滚动元素中，则给可滚动的父级进行事件绑定
      getScrollElementAndCalc()
    })
    onUpdated(() => {
      if (!justNow.value) {
        calcTriggerRect()
        getDefaultRootSize(defaultRoot.value)

        toGetDefaultPlacement()
      }
    })

    watch(visible, (v) => {
      emit('update:show', v)
      if (v) {
        addZIndex()
        calcTriggerRect()
        getScrollElementAndCalc()
      } else {
        removeEvent(scrollElements, 'scroll', handleParentScroll)
      }
    })
    watch(
      () => props.show,
      (v) => {
        set({ item: v })
      }
    )

    return () => {
      let trigger_content =
        vnode_trigger.value === undefined
          ? undefined
          : cloneVNode(vnode_trigger.value, { ref: triggerRoot })

      let default_content = (
        <Transition
          name={props.transitionName}
          onBeforeEnter={(el) => {
            getDefaultRootSize(el)

            toGetDefaultPlacement()
          }}
          onAfterEnter={(el) => {
            justNow.value = false
          }}>
          {visible.value ? (
            <div {...defaultOptions.value}>{vnode_default.value}</div>
          ) : null}
        </Transition>
      )

      if (props.canCloseByClickOutside) {
        const directive: DirectiveArguments = [
          [
            click_outside!,
            {
              handler: hide,
              exclude: [...props.exclude, defaultRoot.value]
            }
          ]
        ]
        if (trigger_content) {
          trigger_content = withDirectives(trigger_content, directive)
        }
      }

      if (!props.nearby) {
        default_content = <Teleport to={'body'}>{default_content}</Teleport>
      } else {
        //另外一种情况暂未考虑TODO:
      }

      return (
        <>
          {trigger_content}
          {props.hasMask && (
            <Mask
              show={visible.value}
              zIndex={zIndex.value - 1}
              onUpdate:show={(v) => {
                visible.value = v
              }}
            />
          )}
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

function useTriggerType(el: Ref, triggerType: TriggerType, handler: Function) {
  switch (triggerType) {
    case 'click':
      useEvent(el, triggerType, handler)
      break
    case 'hover':
      useEvent(el, 'mouseenter', handler)
      useEvent(el, 'mouseleave', handler)
      break
    case 'focus':
      useTabIndex(el)
      useEvent(el, 'focus', handler)
      useEvent(el, 'blur', handler)
  }
}
