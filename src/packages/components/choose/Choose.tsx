import {
  ref,
  watch,
  computed,
  defineComponent,
  provide,
  readonly,
  renderSlot,
  reactive,
  toRefs,
  mergeProps
} from 'vue'
import Layer, { LayerProps } from '../layer/index'
import Virtual from '../virtual/index'
import Close from '../close/index'
import Icon from '../icon/index'
import Fallback from '../fallback/index'
import Item from './ChooseItem'
import {
  SetCurrentValueKey,
  SetCurrentLabelKey,
  CurrentValueKey,
  CurrentLabelKey,
  ToCloseKey,
  ChooseLayerSizeKey
} from './injectionKey'
import { RectType } from '../../config/types'
import { isArray } from '../../util'

function Placeholder(props: { placeholder?: string }) {
  return <span class="w-choose-placeholder">{props.placeholder}</span>
}

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
  placeholder: String,
  clearable: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  modelValue: { type: [Number, String], default: undefined },
  mode: { type: String, default: 'default' },
  lazyLoad: { type: Function }
}

const Choose = defineComponent({
  name: 'Choose',
  inheritAttrs: false,
  components: { Layer, Virtual, Close, Icon, Fallback },
  props,
  emit: ['update:show', 'update:modelValue', 'change'],
  setup(props, ctx) {
    const transitionName = 'w-slide-y'
    const visible = ref(props.show)
    const data = ref<any[] | object | null | undefined>()
    const loading = ref(false)
    const txt = ref<number | string | undefined>()
    const triggerRect = ref<RectType>()
    const layerSize = reactive({
      width: 0,
      height: 0
    })
    provide(ChooseLayerSizeKey, toRefs(layerSize))
    const showCloseBtn = computed(() => {
      if (props.disabled) {
        return false
      }
      if (props.clearable) {
        return props.modelValue !== undefined
      }
    })
    const layerContentStyle = computed(() => {
      if (triggerRect.value) {
        return { minWidth: triggerRect.value.width + 'px' }
      }
      return {}
    })
    const layerOptions = computed(() => {
      return {
        bind: props.bind,
        placement: props.placement,
        hasArrow: props.hasArrow,
        gap: props.gap,
        transitionName,
        layerClass: [props.layerClass],
        layerStyle: layerContentStyle.value,
        show: visible.value,
        'onUpdate:show': (v: boolean) => {
          visible.value = v
        },
        'onGet-trigger-rect': (rect: RectType) => {
          triggerRect.value = rect
        },
        'onGet-layer-size': ({
          width,
          height
        }: {
          width: number
          height: number
        }) => {
          layerSize.width = width
          layerSize.height = height
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
      const triggerOptions = mergeProps(
        {
          class: [
            'w-choose-trigger',
            [`w-choose-mode-${props.mode}`],
            {
              'w-choose-spread': visible.value,
              'w-choose-disabled': props.disabled,
              'w-choose-block': props.block
            }
          ]
        },
        { ...ctx.attrs }
      )
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
          {txt.value ? (
            <span class="w-choose-text">{txt.value}</span>
          ) : (
            <Placeholder placeholder={props.placeholder} />
          )}

          {showCloseBtn.value ? (
            <Close {...closeOptions} />
          ) : (
            <Icon name="w-icon-arrow-down" {...arrowOptions} />
          )}
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
          let isEmpty = false
          if (!data.value) {
            isEmpty = true
          } else {
            if (isArray(data.value) && data.value.length === 0) {
              isEmpty = true
            }
          }
          const fallback = (
            <Fallback
              loading={loading.value}
              empty={isEmpty}
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
            if (loading.value || isEmpty) {
              return fallback
            }
            return content
            // if (data.value) {
            //   if (isArray(data.value) && data.value.length === 0) {
            //     return fallback
            //   }
            //   return content
            // }
            // return fallback
          } else {
            const cont = ctx.slots.default?.()
            return cont
          }
        }, //props.lazyLoad ? renderLazyContent : ctx.slots.default,
        trigger: renderTrigger
      }
      const options = layerOptions.value as any
      return <Layer v-slots={layerSlots} {...options} />
    }
  }
})
Choose.item = Item
export default Choose
