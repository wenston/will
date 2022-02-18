import { defineComponent, ref, computed, watch, onMounted } from 'vue'
import { isArray, isObject, getItemValue } from '../../util'
import Fallback from '../fallback/index'
import Checkbox from '../checkbox/index'

export default defineComponent({
  components: { Fallback, Checkbox },
  props: {
    data: [Array, Object],
    disabled: Boolean,
    checkable: Function,
    activable: Function,
    keys: { type: Array, default: () => [] }, //用来初始化本组件内已选的数据，会传给checkedKeys
    keyField: { type: String, default: 'Id' },
    textField: { type: String, default: 'Name' },
    hasCheckbox: { type: Boolean, default: false },
    ...Fallback.props
  },
  emits: ['toggle', 'update:keys'],
  setup(props, ctx) {
    const checkedKeys = ref<any[]>(props.keys)
    function renderItems() {
      const d = props.data
      if (d && isArray(d)) {
        const items = d.map((item: any, index: number) => {
          const isActive = props.activable && props.activable(item, index)
          const isChecked =
            props.hasCheckbox &&
            checkedKeys.value.some((k) => k == item[props.keyField])
          const isDisabled = props.checkable
            ? !props.checkable(item, index)
            : false
          const itemOptions = {
            // key: item[props.keyField],
            class: [
              'w-list-item',
              {
                'w-list-item-active': isActive,
                'w-list-item-disabled': isDisabled
              }
            ],
            onClick: (e: MouseEvent) => {
              if (isDisabled) {
                return
              }
              //   if (!isActive) {
              ctx.emit('toggle', item, index)
              //   }
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
                }
              ],
              modelValue: checkedKeys.value,
              value: item[props.keyField],
              disabled: isDisabled,
              'onUpdate:modelValue': (arr: any[]) => {
                checkedKeys.value = arr

                ctx.emit('toggle', item, index, [...checkedKeys.value])
                ctx.emit('update:keys', [...checkedKeys.value])
              }
            }
            return <Checkbox {...checkboxOptions}>{cont}</Checkbox>
          }
          return <div {...itemOptions}>{cont}</div>
        })
        return items
      } else if (isObject(d)) {
      }
    }
    onMounted(() => {})
    watch(
      () => props.keys,
      (arr: any[]) => {
        checkedKeys.value = arr
      }
    )
    return () => {
      const fallback = <Fallback loading={props.loading} empty={props.empty} />
      return props.loading || props.empty ? (
        fallback
      ) : (
        <div class="w-list">{renderItems()}</div>
      )
    }
  }
})
