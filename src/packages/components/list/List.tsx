import { defineComponent, computed } from 'vue'
import { isArray, isObject } from '../../util'

export default defineComponent({
  props: {
    data: [Array, Object],
    modelValue: [String, Number],
    disabled: Boolean,
    checkable: Function,
    activable: Function,
    keyField: { type: String, default: 'Id' },
    textField: { type: String, default: 'Name' }
  },
  emits: ['update:modelValue', 'toggle'],
  setup(props, ctx) {
    function renderItems() {
      const d = props.data
      if (d && isArray(d)) {
        const items = d.map((item: any, index: number) => {
          const isActive = props.activable && props.activable(item, index)
          const isDisabled = props.checkable && props.checkable(item, index)
          const itemOptions = {
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
          return <div {...itemOptions}>{item[props.textField]}</div>
        })
        return items
      } else if (isObject(d)) {
      }
    }
    return () => {
      return <div class="w-list">{renderItems()}</div>
    }
  }
})
