import { computed, ref, defineComponent } from 'vue'
import Layer from '../layer/index'
import Close from '../close/index'
import Arrow from '../arrow/index'
import Write from '../write/index'
import List from '../list/index'
import type { ListItemType } from '../list/List'
import Checkbox from '../checkbox/index'
import useSearch from '../../use/useSearch'
const { hasCheckbox, keys, data, ...listProps } = List.props
export default defineComponent({
  inheritAttrs: false,
  name: 'Choose2',
  components: { Layer, Close, Arrow, Write, List, Checkbox },
  props: {
    show: { type: Boolean, default: false },
    placeholder: { type: String },
    searchPlaceholder: { type: String, default: '关键字搜索' },
    modelValue: { type: Array, default: () => [] },
    ...listProps
  },
  emits: ['update:show', 'update:modelValue'],
  setup(props, { emit, slots }) {
    const visible = ref(props.show)
    const searchText = ref('')
    const isCheckAll = ref(false)
    const filterData = useSearch<ListItemType>(
      computed(() => props.data),
      searchText,
      ref(false),
      props.textField
    )
    const layerOptions = computed<Record<any, any>>(() => {
      return {
        show: visible.value,
        placement: 'bottom-start',
        hasArrow: false,
        gap: 2,
        transitionName: 'w-slide-y',
        'onUpdate:show': (b: boolean) => {
          visible.value = b
        }
      }
    })
    const dataListOptions = computed(() => {
      const listPropsKeys = Object.keys(listProps)
      return listPropsKeys.reduce(
        (obj, key) => {
          obj[key] = props[key]
          return obj
        },
        {
          class: 'w-choose2-layer',
          data: filterData.value,
          hasCheckbox: true,
          onToggle: (item: Record<any, any>, index: number, arr: any[]) => {
            console.log(item, index, arr)
          },
          keys: props.modelValue,
          'onUpdate:keys': (arr: any[]) => {
            emit('update:modelValue', arr)
          }
        } as Record<any, any>
      )
    })
    function renderTrigger() {
      const arrowBtn = <Arrow rotate={visible.value} />
      const closeBtn = <Close />
      const triggerOptions = {
        class: ['w-choose2-trigger']
      }
      return (
        <div {...triggerOptions}>
          <div>text</div>
          <div class="w-choose2-icon">{arrowBtn}</div>
        </div>
      )
    }
    function renderContent() {
      const writeOptions = {
        modelValue: searchText.value,
        placeholder: props.searchPlaceholder,
        block: true,
        'onUpdate:modelValue': (v: string) => {
          searchText.value = v
        }
      }
      const write = <Write {...writeOptions} />

      const listSlots = slots.default && {
        default: ({ item, index }: { item: Record<any, any>; index: number }) =>
          slots.default?.({ item, index })
      }
      const checkOptions = {
        text: '全选',
        modelValue: isCheckAll.value,
        'onUpdate:modelValue': (b: boolean) => {
          isCheckAll.value = b
        }
      }
      return [
        <div class="w-choose2-search">{write}</div>,
        <List {...dataListOptions.value} v-slots={listSlots} />,
        <div class="w-choose2-checkall">
          <Checkbox text="全选" />
        </div>
      ]
    }
    return () => {
      const layerSlots = {
        trigger: renderTrigger,
        default: renderContent
      }
      return <Layer v-slots={layerSlots} {...layerOptions.value} />
    }
  }
})
