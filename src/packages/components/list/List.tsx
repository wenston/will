import type { PropType } from 'vue'
import {
  defineComponent,
  ref,
  computed,
  watch,
  onMounted,
  normalizeClass
} from 'vue'
import { isArray, isObject, getItemValue } from '../../util'
import Fallback from '../fallback/index'
import Checkbox from '../checkbox/index'
import useSearch from '../../use/useSearch'
export type ListItemType = Record<string, any>
export default defineComponent({
  inheritAttrs: false,
  components: { Fallback, Checkbox },
  props: {
    data: [Array, Object] as PropType<ListItemType[]>,
    disabled: Boolean,
    checkable: Function,
    activable: Function,
    searchText: String,
    all: Boolean,
    keys: { type: Array, default: () => [] }, //用来初始化本组件内已选的数据，会传给checkedKeys
    keyField: { type: String, default: 'Id' },
    textField: { type: String, default: 'Name' },
    hasCheckbox: { type: Boolean, default: false },
    itemClass: { type: [Array, Object, String] },
    ...Fallback.props
  },
  emits: ['toggle', 'update:keys', 'update:all' /* 'update:searchText' */],
  setup(props, ctx) {
    const checkedKeys = ref<any[]>(props.keys)
    const _st = ref<string>(props.searchText || '')
    const _isAll = ref<boolean>(props.all)
    const hasResult = computed(() => {
      const d = filterData.value
      const sd = props.data
      if (sd.length) {
        return d.length > 0
      }
      return props.loading || props.empty
    })
    const dontSearch = ref(false)
    const filterData = useSearch<ListItemType>(
      computed(() => props.data),
      _st,
      dontSearch,
      props.textField
    )
    function search(text: string) {
      _st.value = text
      setTimeout(toCheckAll)
      // 由于本组件内部没有输入框，故text一直都是从外部传入，所以以下可以不要
      // ctx.emit('update:searchText', text)
    }
    function checkAll(checked: boolean) {
      const d = filterData.value
      if (d && isArray(d)) {
        if (checked) {
          checkedKeys.value = d.filter(is_d).map((item) => item[props.keyField])
        } else {
          checkedKeys.value = []
        }
        ctx.emit('update:keys', [...checkedKeys.value])
      }
      _isAll.value = checked
    }
    function renderItem(
      item: ListItemType,
      index: number,
      {
        isActive,
        isDisabled,
        isChecked
      }: { isActive: boolean; isDisabled: boolean; isChecked: boolean }
    ) {
      const itemOptions = {
        // key: item[props.keyField],
        class: [
          'w-list-item',
          {
            'w-list-item-active': isActive,
            'w-list-item-disabled': isDisabled
          },
          normalizeClass(props.itemClass)
        ],
        onClick: () => {
          if (isDisabled) {
            return
          }
          ctx.emit('toggle', item, index)
        }
      }
      const cont =
        ctx.slots.default?.({
          item,
          index
        }) ?? getItemValue(item, props.textField)
      if (props.hasCheckbox) {
        const checkboxOptions = {
          class: [
            'w-list-item',
            {
              'w-list-item-disabled': isDisabled,
              'w-list-item-active': isChecked
            },
            normalizeClass(props.itemClass)
          ],
          modelValue: checkedKeys.value,
          value: item[props.keyField],
          disabled: isDisabled,
          'onUpdate:modelValue': (arr: any[]) => {
            checkedKeys.value = arr

            ctx.emit(
              'toggle',
              item,
              index,
              filterData.value.filter((item) =>
                checkedKeys.value.some((k) => k == item[props.keyField])
              )
            )
            ctx.emit('update:keys', [...checkedKeys.value])
          },
          onChange: (b: boolean) => {
            if (b) {
              toCheckAll()
            } else {
              _isAll.value = false
            }
            ctx.emit('update:all', _isAll.value)
          }
        }
        return <Checkbox {...checkboxOptions}>{cont}</Checkbox>
      }
      return <div {...itemOptions}>{cont}</div>
    }
    function renderList() {
      const d = filterData.value
      let b = true
      if (d && isArray(d)) {
        const items = d.map((item: ListItemType, index: number) => {
          const isActive = props.activable && props.activable(item, index)
          const isChecked = is_c(item)
          const isDisabled = !is_d(item, index)

          if (!isChecked) {
            b = false
          }
          return renderItem(item, index, { isActive, isChecked, isDisabled })
        })
        if (items.length) {
          _isAll.value = b
        }
        return items
      }
    }
    function is_c(item: ListItemType) {
      return (
        props.hasCheckbox &&
        checkedKeys.value.some((k) => k == item[props.keyField])
      )
    }
    function is_d(item: ListItemType, index: number) {
      return props.checkable ? props.checkable(item, index) : true
    }
    function toCheckAll() {
      const keys = checkedKeys.value
      const filters = filterData.value.filter(is_d)
      let b = false
      if (keys.length > 0 && filters.length > 0) {
        if (filters.length > keys.length) {
          b = false
        } else {
          b = filters.every((item) =>
            keys.some((_k) => _k == item[props.keyField])
          )
        }
      }
      _isAll.value = b
      ctx.emit('update:all', b)
    }
    function wrapper(cont: any) {
      return (
        <>
          {ctx.slots.search?.({ search })}
          {cont}
          {ctx.slots.checkAll?.({ checkAll })}
        </>
      )
    }
    onMounted(() => {})
    watch(
      () => props.keys,
      (arr: any[]) => {
        checkedKeys.value = arr
      }
    )
    watch(
      () => props.searchText,
      (t: string) => {
        _st.value = t
      }
    )
    return () => {
      const fallback = <Fallback loading={props.loading} empty={props.empty} />
      return props.loading || props.empty
        ? wrapper(fallback)
        : hasResult.value
        ? wrapper(
            <div class={['w-list', normalizeClass(ctx.attrs.class)]}>
              {renderList()}
            </div>
          )
        : wrapper(
            <Fallback
              empty={true}
              emptyProps={{ text: '没有匹配到相关数据' }}
            />
          )
    }
  }
})
