import type { PropType } from 'vue'
import { computed, ref, defineComponent, watch } from 'vue'
import type { RectType } from '../../config/types'
import Layer, { LayerProps } from '../layer/index'
import Write from '../write/index'
import Arrow from '../arrow/index'
import Close from '../close/index'
import List from '../list/index'
import useSearch from '../../use/useSearch'
import useRequest from '../../use/useRequest'
import { getItemValue, isArray, isValidValue } from '../../util'
type DataItemType = string | number | Record<string, any>
export default defineComponent({
  name: 'Match',
  inheritAttrs: false,
  components: { Write, Layer, Arrow, Close, List },
  props: {
    data: { type: Array as PropType<DataItemType[]>, default: () => [] },
    placement: {
      ...LayerProps.placement,
      default: 'bottom-start'
    },
    gap: { ...LayerProps.gap, default: 2 },
    show: { type: Boolean, default: false },
    modelValue: { type: [String, Number], default: undefined },
    //text用在数据延迟加载时，无数据匹配的情况
    text: { type: String, default: '' },
    placeholder: { type: String, default: '请输入关键字' },
    readonly: { type: Boolean },
    disabled: { type: Boolean },
    block: { type: Boolean },
    //当props.data为json数组时，如何用类型系统将keyField和textField规范成必传项？
    keyField: { type: String, default: 'Id' },
    textField: { type: String, default: 'Name' },
    checkable: Function as PropType<
      (item: DataItemType, index: number) => boolean
    >,
    //所要匹配的数据是固定的，但数据会懒加载，加载时机：输入关键字匹配时，或者下拉框出现时
    lazyLoad: Function as PropType<() => Promise<DataItemType[]>>,
    //异步函数，有此函数的话，搜索结果一直从后台匹配
    request: Function as PropType<() => Promise<DataItemType[]>>
  },
  emits: ['update:show', 'update:modelValue', 'update:text', 'change'],
  setup(props, ctx) {
    const transitionName = 'w-slide-y'
    const searchText = ref<string>('')
    const dontSearch = ref(false)
    const filterData = useSearch(
      computed(() => props.data || []),
      searchText,
      dontSearch,
      props.textField,
      afterSearch
    )
    const {
      data: reqData,
      loading,
      empty,
      get: getData
    } = useRequest(props.request, searchText, true)
    const {
      loading: isLoading,
      empty: lazyEmpty,
      get: lazyGet
    } = useRequest(props.lazyLoad, ref(''), true)
    const isEmpty = computed(() => {
      return filterData.value.length === 0 || lazyEmpty.value
    })
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
    watch(
      [() => props.data, () => props.modelValue],
      ([d, v]) => {
        if (d && d.length && isValidValue(v)) {
          const item = d.filter((_d) => {
            return getItemValue(_d, props.keyField) === v
          })[0]
          if (item) {
            const _text = getItemValue(item, props.textField)
            if (searchText.value === '' || searchText.value !== _text) {
              dontSearch.value = true
              searchText.value = _text
            }
          }
        }
      },
      { immediate: true }
    )

    //当数据是延迟加载、且需要数据回显时
    const stopWatchText = watch(
      () => props.text,
      (t) => {
        if (props.lazyLoad) {
          if (!props.data || (isArray(props.data) && props.data.length === 0)) {
            searchText.value = t
          } else {
            stopWatchText()
          }
        }
      },
      { immediate: true }
    )

    function _clear() {
      ctx.emit('update:modelValue', undefined)
      ctx.emit('update:text', '')
      ctx.emit('change', {
        item: undefined,
        index: undefined
      })
    }
    //在输入框内输入或者粘贴搜索后，根据搜索结果来进行下一步
    //如果全匹配则自动选中，如果没有匹配到，则提示无匹配数据
    //如果有多个匹配结果，则展示出来匹配的数据列表
    // 注意： 当有props.request时，afterSearch不会触发
    function afterSearch(
      resultLength: number,
      isFullData: boolean, //是否是全量数据
      isEqual?: boolean,
      index?: number
    ) {
      if (!isFullData) {
        if (resultLength > 0) {
          if (isEqual) {
            const item = filterData.value[0]!
            toEmit(item, index!)
          } else {
            _clear()
          }
        } else {
        }
      }

      visible.value = true
    }
    function toEmit(item: DataItemType, index: number) {
      const _key = getItemValue(item, props.keyField)
      const _text = getItemValue(item, props.textField)
      searchText.value = _text
      ctx.emit('update:text', _text)
      ctx.emit('update:modelValue', _key)
      ctx.emit('change', {
        item,
        index
      })
    }
    function toLoad() {
      if (props.lazyLoad && props.data?.length === 0) {
        lazyGet()
      }
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
          searchText.value = val
          if (props.request) {
            dontSearch.value = true
            if (val !== '') {
              visible.value = true
              getData()
            } else {
              //空字符串不搜索
              visible.value = false
            }
          } else {
            toLoad()
            dontSearch.value = false
          }
        },
        onClear: () => {
          if (props.request) {
            dontSearch.value = true
            visible.value = false
          } else {
            dontSearch.value = false
          }
          searchText.value = ''
          _clear()
        }
      }
      const writeSlots = {
        default: ({ focus }: { focus: () => void }) => {
          if (!props.request) {
            const arrowOptions = {
              class: 'w-cursor-pointer',
              rotate: visible.value,
              onClick: (e: MouseEvent) => {
                toLoad()
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
      }
      return <Write {...writeOptions} v-slots={writeSlots}></Write>
    }
    return () => {
      const layerSlots = {
        trigger: renderTrigger,
        default: () => {
          const listOptions = {
            data: props.request ? reqData.value : filterData.value,
            keyField: props.keyField,
            textField: props.textField,
            loading: props.request ? loading.value : isLoading.value,
            empty: props.request ? empty.value : isEmpty.value,
            checkable: props.checkable,
            activable: (item: any, index: number) => {
              return getItemValue(item, props.keyField) === props.modelValue
              // return item[props.keyField] === props.modelValue
            },
            onToggle: (item: any, index: number) => {
              const key = getItemValue(item, props.keyField)
              if (key !== props.modelValue) {
                //不进行useSearch里的匹配，不会触发afterSearch
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
