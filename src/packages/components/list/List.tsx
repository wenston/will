import { defineComponent, computed, onMounted } from 'vue'
import { isArray, isObject, getItemValue } from '../../util'
import Fallback from '../fallback/index'

export default defineComponent({
  components: { Fallback },
  props: {
    data: [Array, Object],
    disabled: Boolean,
    checkable: Function,
    activable: Function,
    keyField: { type: String, default: 'Id' },
    textField: { type: String, default: 'Name' },
    ...Fallback.props
  },
  emits: ['toggle'],
  setup(props, ctx) {
    function renderItems() {
      const d = props.data
      if (d && isArray(d)) {
        const items = d.map((item: any, index: number) => {
          const isActive = props.activable && props.activable(item, index)
          const isDisabled = props.checkable
            ? !props.checkable(item, index)
            : false
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
          return (
            <div {...itemOptions}>{getItemValue(item, props.textField)}</div>
          )
        })
        return items
      } else if (isObject(d)) {
      }
    }
    onMounted(() => {
      // console.log('list挂载')
    })
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
