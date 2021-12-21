import { ref, watch, computed, defineComponent, provide, readonly } from 'vue'
import Layer, { LayerProps } from '../layer/index'
import Virtual from '../virtual/index'
import Close from '../close/index'
import Arrow from '../arrow/index'
import Loading from '../loading/index'
import Empty from '../empty/index'
import Fallback from '../fallback/index'
import {
  SetCurrentValueKey,
  SetCurrentLabelKey,
  CurrentValueKey,
  CurrentLabelKey,
  ToCloseKey
} from './injectionKey'
import { RectType } from '../../config/types'
import { isArray } from '../../util'
const props = {
  ...LayerProps,
  //v-show时，Choose.item组件已经创建好了；v-if时，Choose.item是在展开时才初始化的
  bind: { type: LayerProps.bind.type, default: 'v-show' },
  placement: { type: LayerProps.placement.type, default: 'bottom-start' },
  hasArrow: { type: LayerProps.hasArrow.type, default: false },
  gap: { type: LayerProps.gap.type, default: 2 },
  layerClass: {
    type: LayerProps.layerClass.type,
    default: () => 'w-choose-layer'
  },

  clearable: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  modelValue: { type: [Number, String], default: undefined },
  lazyLoad: { type: Function }
}
export default defineComponent({
  inheritAttrs: false,
  components: { Layer, Virtual, Close, Arrow },
  props,
  emit: ['update:show', 'update:modelValue', 'change'],
  setup(props, ctx) {
    const visible = ref(props.show)
    const data = ref<any[] | object | null | undefined>()
    const loading = ref(false)
    const txt = ref<number | string | undefined>()
    const triggerRect = ref<RectType>()
    const showCloseBtn = computed(() => {
      if (props.disabled) {
        return false
      }
      return props.modelValue !== undefined
    })
    const showArrowBtn = computed(() => {
      return props.modelValue === undefined
    })
    const layerContentStyle = computed(() => {
      if (triggerRect.value) {
        return { width: triggerRect.value.width + 'px' }
      }
      return {}
    })
    const layerOptions = computed(() => {
      return {
        bind: props.bind,
        placement: props.placement,
        hasArrow: props.hasArrow,
        gap: props.gap,
        transitionName: 'w-slide-y',
        layerClass: [props.layerClass],
        layerStyle: layerContentStyle.value,
        show: visible.value,
        'onUpdate:show': (v: boolean) => {
          visible.value = v
        },
        'onGet-trigger-rect': (rect: RectType) => {
          triggerRect.value = rect
        }
      }
    })
    provide(SetCurrentLabelKey, (v) => {
      txt.value = v
    })
    provide(SetCurrentValueKey, (v) => {
      ctx.emit('update:modelValue', v)
      ctx.emit(
        'change',
        readonly({
          label: txt.value,
          value: v
        })
      )
    })
    provide(
      CurrentValueKey,
      computed(() => props.modelValue)
    )
    provide(CurrentLabelKey, readonly(txt))
    provide(ToCloseKey, () => {
      visible.value = false
    })
    watch(
      () => props.show,
      (v) => {
        visible.value = v
      }
    )
    watch(visible, (v) => {
      ctx.emit('update:show', v)
      if (v) {
        toLoad()
      }
    })
    function renderTrigger() {
      const triggerOptions = {
        class: [
          'w-choose-trigger',
          {
            'w-choose-spread': visible.value,
            'w-choose-disabled': props.disabled,
            'w-choose-block': props.block
          }
        ],
        ...ctx.attrs
      }
      const closeOptions = {
        class: 'w-choose-close-btn',
        name: 'w-icon-close-fill',
        onClick: (e: MouseEvent) => {
          ctx.emit('update:modelValue', undefined)
          txt.value = undefined
          ctx.emit(
            'change',
            readonly({
              label: undefined,
              value: undefined
            })
          )
          e.stopPropagation()
        }
      }
      const arrowOptions = {
        class: 'w-choose-arrow-btn',
        rotate: visible.value
      }
      return (
        <div {...triggerOptions}>
          <span class="w-choose-text">{txt.value}</span>
          {showArrowBtn.value && <Arrow {...arrowOptions} />}
          {showCloseBtn.value && <Close {...closeOptions} />}
        </div>
      )
    }

    function toLoad() {
      if (props.lazyLoad) {
        if (
          data.value === undefined ||
          (isArray(data.value) && data.value.length === 0)
        ) {
          loading.value = true
          props
            .lazyLoad()
            .then((d: any[] | object | null | undefined) => {
              data.value = d
              loading.value = false
            })
            .catch((err: any) => {
              loading.value = false
            })
        }
      }
    }

    return () => {
      const layerSlots = {
        default: () => {
          const fallback = (
            <Fallback
              loading={loading.value}
              class="w-choose-fallback"
              loadingProps={{
                text: '加载数据中'
              }}
              emptyProps={{
                text: '暂无相关数据'
              }}
              v-slots={{ loading: ctx.slots.loading, empty: ctx.slots.empty }}
            />
          )
          const content = ctx.slots.default?.({
            data: data.value,
            loading: loading.value
          })
          if (props.lazyLoad) {
            if (data.value) {
              if (isArray(data.value) && data.value.length === 0) {
                return fallback
              }
              return content
            }
            return fallback
          } else {
            return ctx.slots.default?.()
          }
        }, //props.lazyLoad ? renderLazyContent : ctx.slots.default,
        trigger: renderTrigger
      }
      const options = layerOptions.value as any
      return <Layer v-slots={layerSlots} {...options} />
    }
  }
})
