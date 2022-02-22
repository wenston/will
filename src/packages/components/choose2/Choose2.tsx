import type { PropType } from 'vue'
import type { ListItemType } from '../list/List'
import { computed, ref, watch, defineComponent } from 'vue'
import Layer from '../layer/index'
import Close from '../close/index'
import Arrow from '../arrow/index'
import Write from '../write/index'
import List from '../list/index'
import Checkbox from '../checkbox/index'
import useRequest from '../../use/useRequest'
const { hasCheckbox, keys, searchText, all, loading, empty, ...listProps } =
  List.props
export default defineComponent({
  inheritAttrs: false,
  name: 'Choose2',
  components: { Layer, Close, Arrow, Write, List, Checkbox },
  props: {
    show: { type: Boolean, default: false },
    disabled: Boolean,
    block: Boolean,
    clearable: Boolean,
    textPlaceholder: { type: String },
    placeholder: { type: String },
    searchPlaceholder: { type: String, default: '关键字搜索' },
    modelValue: { type: Array, default: () => [] },
    lazyLoad: Function as PropType<() => Promise<ListItemType[]>>,
    ...listProps
  },
  emits: ['update:show', 'update:modelValue', 'clear'],
  setup(props, { emit, slots }) {
    const visible = ref(props.show)
    const searchText = ref('')
    const isCheckAll = ref(false)
    const placeholderText = computed(() => {
      const v = props.modelValue
      if (v && v.length) {
        return (
          <span class="w-no-select">{`已选${v.length}项${
            props.textPlaceholder ?? ''
          }`}</span>
        )
      }
      return (
        <span class="w-text-placeholder w-no-select">{props.placeholder}</span>
      )
    })
    const layerOptions = computed<Record<any, any>>(() => {
      return {
        show: visible.value,
        disabled: props.disabled,
        placement: 'bottom-start',
        hasArrow: false,
        gap: 2,
        transitionName: 'w-slide-y',
        'onUpdate:show': (b: boolean) => {
          visible.value = b
        }
      }
    })
    const {
      loading: _loading,
      empty: _empty,
      get: _getData
    } = useRequest(props.lazyLoad, undefined, true)
    const dataListOptions = computed(() => {
      const listPropsKeys = Object.keys(listProps)
      return listPropsKeys.reduce(
        (obj, key) => {
          obj[key] = props[key]
          return obj
        },
        {
          class: 'w-choose2-layer',
          loading: _loading.value,
          empty: _empty.value,
          hasCheckbox: true,
          all: isCheckAll.value,
          searchText: searchText.value,
          onToggle: (item: Record<any, any>, index: number, arr: any[]) => {
            console.log(item, index, arr)
          },
          keys: props.modelValue,
          'onUpdate:keys': (arr: any[]) => {
            emit('update:modelValue', arr)
          },
          'onUpdate:all': (b: boolean) => {
            isCheckAll.value = b
          }
        } as Record<any, any>
      )
    })
    function renderTrigger() {
      const arrowBtn = <Arrow rotate={visible.value} />
      const closeBtn =
        !props.disabled &&
        props.clearable &&
        props.modelValue &&
        props.modelValue.length ? (
          <Close
            name="w-icon-close-fill"
            onClick={(e: MouseEvent) => {
              e.stopPropagation()
              clear()
            }}
          />
        ) : null
      const triggerOptions = {
        class: [
          'w-choose2-trigger',
          {
            'w-choose2-trigger-disabled': props.disabled,
            'w-choose2-trigger-block': props.block,
            'w-choose2-trigger-active': visible.value
          }
        ]
      }
      return (
        <div {...triggerOptions}>
          <div>{placeholderText.value}</div>
          <div class="w-choose2-icon">
            {closeBtn}
            {arrowBtn}
          </div>
        </div>
      )
    }
    function renderContent() {
      if (props.disabled) {
        return null
      }
      const listSlots = slots.default && {
        default: ({ item, index }: { item: Record<any, any>; index: number }) =>
          slots.default?.({ item, index }),
        search: ({ search }: { search: (t: string) => void }) => {
          const writeOptions = {
            simple: true,
            modelValue: searchText.value,
            placeholder: props.searchPlaceholder,
            block: true,
            'onUpdate:modelValue': (v: string) => {
              searchText.value = v
              search(v)
            }
          }

          return <Write {...writeOptions} />
        },
        checkAll: ({ checkAll }: { checkAll: (b: boolean) => void }) => {
          const checkOptions = {
            text: '全选',
            value: [false, true],
            modelValue: isCheckAll.value,
            'onUpdate:modelValue': (b: boolean) => {
              isCheckAll.value = b
              checkAll(b)
            }
          }
          return (
            <div class="w-choose2-checkall">
              <Checkbox {...checkOptions} />
            </div>
          )
        }
      }
      return <List {...dataListOptions.value} v-slots={listSlots} />
    }
    function clear() {
      isCheckAll.value = false
      emit('update:modelValue', [])
      emit('clear')
    }

    const stopLoadData = watch(
      visible,
      (v: boolean) => {
        if (v) {
          if (props.data && props.data.length) {
            stopLoadData()
          } else {
            _getData()
          }
        }
      },
      { immediate: true }
    )
    return () => {
      const layerSlots = {
        trigger: renderTrigger,
        default: renderContent
      }
      return <Layer v-slots={layerSlots} {...layerOptions.value} />
    }
  }
})
