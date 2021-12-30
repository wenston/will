import type { PropType } from 'vue'
import { computed, ref, defineComponent, watch } from 'vue'
import type { RectType } from '../../config/types'
import Layer, { LayerProps } from '../layer/index'
import Write from '../write/index'
import Arrow from '../arrow/index'
import Close from '../close/index'
import Fallback from '../fallback/index'
import Virtual from '../virtual/index'
import List from '../list/index'
import useSearch from '../../use/useSearch'
type DataItemType = string | number | Record<string, any>
export default defineComponent({
  name: 'Match',
  inheritAttrs: false,
  components: { Write, Layer, Arrow, Close, Fallback, Virtual, List },
  props: {
    data: { type: Array as PropType<DataItemType[]>, default: () => [] },
    placement: {
      ...LayerProps.placement,
      default: 'bottom-start'
    },
    gap: { type: LayerProps.gap.type, default: 2 },
    show: { type: Boolean, default: false },
    modelValue: { type: [String, Number], default: undefined },
    placeholder: { type: String, default: '请输入关键字' },
    readonly: { type: Boolean },
    disabled: { type: Boolean },
    block: { type: Boolean },
    keyField: { type: String, default: 'Id' },
    textField: { type: String, default: 'Name' },
    checkable: Function
  },
  emits: ['update:show', 'update:modelValue', 'change'],
  setup(props, ctx) {
    const transitionName = 'w-slide-y'
    const searchText = ref<string | undefined>('')
    const dontSearch = ref(false)
    const filterData = useSearch(
      computed(() => props.data || []),
      searchText,
      dontSearch,
      props.textField,
      afterSearch
    )
    const currentText = ref('')
    const triggerRect = ref<RectType>()
    const visible = ref(props.show)

    const layerContentStyle = computed(() => {
      if (triggerRect.value) {
        return { minWidth: triggerRect.value.width + 'px' }
      }
      return {}
    })
    const layerOptions = computed(() => {
      return {
        manual: true,
        hasArrow: false,
        transitionName,
        show: visible.value,
        gap: props.gap,
        layerClass: ['w-match-layer'],
        layerStyle: layerContentStyle.value,
        'onUpdate:show': (v: boolean) => {
          visible.value = v
        },
        placement: props.placement,

        'onGet-trigger-rect': (rect: RectType) => {
          triggerRect.value = rect
        }
      }
    })
    watch(
      () => props.show,
      (v) => {
        visible.value = v
      }
    )
    watch(visible, (v) => {
      ctx.emit('update:show', v)
    })
    //在输入框内输入或者粘贴搜索后，根据搜索结果来进行下一步
    //如果全匹配则自动选中，如果没有匹配到，则提示无匹配数据
    //如果有多个匹配结果，则展示出来匹配的数据列表
    function afterSearch(
      resultLength: number,
      isEqual: boolean,
      index: number
    ) {
      if (resultLength > 0) {
        visible.value = true
        if (isEqual) {
          const item = filterData.value[0]!
          toEmit(item, index)
        } else {
          ctx.emit('update:modelValue', undefined)
          ctx.emit('change', {
            item: undefined,
            index: undefined
          })
        }
      }
    }
    function toEmit(item: DataItemType, index: number) {
      let v: number | string | undefined
      if (typeof item === 'number' || typeof item === 'string') {
        v = item
      } else {
        if (!props.textField || !props.keyField) {
          console.warn('textField、keyField传入错误')
          return
        }
      }
      currentText.value = (item as Record<any, any>)[props.textField]
      searchText.value = currentText.value
      ctx.emit('update:modelValue', (item as Record<any, any>)[props.keyField])
      ctx.emit('change', {
        item,
        index
      })
    }
    function renderTrigger() {
      const writeOptions = {
        class: ['w-match', { 'w-match-block': props.block }],
        clearable: true,
        block: props.block,
        placeholder: props.placeholder,
        modelValue: searchText.value,
        'onUpdate:modelValue': (v: string, input: HTMLInputElement) => {
          // console.log(v, input)
          // searchText.value = v
        },
        onSearch: (val: string) => {
          dontSearch.value = false
          searchText.value = val
        },
        onClear: () => {
          currentText.value = ''
          searchText.value = ''
          dontSearch.value = false
          ctx.emit('update:modelValue', undefined)
          ctx.emit('change', {
            item: undefined,
            index: undefined
          })
        }
      }
      const writeSlots = {
        default: ({ focus }: { focus: () => void }) => {
          const arrowOptions = {
            class: 'w-cursor-pointer',
            rotate: visible.value,
            onClick: (e: MouseEvent) => {
              visible.value = !visible.value
              if (visible.value) {
                focus()
              }
              e.stopPropagation()
            }
          }
          return <Arrow {...arrowOptions} />
        }
      }
      return <Write {...writeOptions} v-slots={writeSlots}></Write>
    }
    return () => {
      const layerSlots = {
        trigger: renderTrigger,
        default: () => {
          const listOptions = {
            data: filterData.value,
            keyField: props.keyField,
            textField: props.textField,
            activable: (item: any, index: number) => {
              const k = item[props.keyField]
              if (k === props.modelValue) {
                return true
              }
              return false
            },
            onToggle: (item: any, index: number) => {
              const key = item[props.keyField]
              if (key !== props.modelValue) {
                dontSearch.value = true
                toEmit(item, index)
              }
              visible.value = false
            }
          }
          return <List {...listOptions} />
        }
      }
      return <Layer {...layerOptions.value} v-slots={layerSlots} />
    }
  }
})
