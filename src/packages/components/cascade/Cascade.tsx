import type { PropType } from 'vue'
import { defineComponent, computed, ref, watch, shallowRef } from 'vue'
import Layer from '../layer/index'
import Trigger from '../trigger/index'
import List from '../list/index'
import Icon from '../icon/index'
//defineComponent如何定义类型？
export default defineComponent({
  name: 'Cascade',
  components: { Layer, Trigger, List, Icon },
  props: {
    modelValue: {
      type: Array as PropType<Record<any, any>[]>,
      default: () => []
    },
    show: Boolean,
    disabled: Boolean,
    block: Boolean,
    clearable: Boolean,
    placeholder: String,
    data: { type: Array as PropType<Record<any, any>[]>, default: () => [] }, //级联数据
    keyField: { type: String, default: 'id' },
    textField: { type: String, default: 'name' },
    childField: { type: String, default: 'children' },
    checkable: Function as PropType<() => Promise<boolean>>
  },
  emits: ['update:show', 'update:modelValue'],
  setup(_, { slots, emit }) {
    const visible = ref(_.show)
    //path里的keyField和textField是一定存在的
    //如何用ts更好的定义其类型？
    const path = ref<Record<any, any>[]>(_.modelValue)
    // const current = shallowRef<Record<any, any>>()
    //从原始数据中筛选出的当前项
    const current = computed(() => {
      const f = _.keyField
      const pv = path.value
      const _d = _.data
      if (pv && pv.length && _d && _d.length) {
        const one = pv[0]
        const item = _d.filter((row) => row[f] == one[f])[0]
        if (item) {
          return item
        }
      }
    })

    const layerOptions = computed<Record<any, any>>(() => {
      return {
        layerClass: 'w-cascade-layer',
        show: visible.value,
        disabled: _.disabled,
        placement: 'bottom-start',
        hasArrow: false,
        gap: 2,
        transitionName: 'w-slide-y',
        'onUpdate:show': (b: boolean) => {
          visible.value = b
        }
      }
    })
    const triggerOptions = computed(() => {
      return {
        active: visible.value,
        block: _.block,
        disabled: _.disabled,
        clearable: _.clearable,
        placeholder: _.placeholder
      }
    })

    function isSameItem(item: Record<any, any>, itemInPath: Record<any, any>) {
      if (_.keyField) {
        return item[_.keyField] === itemInPath[_.keyField]
      } else {
        console.warn('请传入keyField参数')
        return false
      }
    }

    function findDetailByKey(k: any, indexPath: number) {
      let arr: Record<any, any>[] | undefined | null = []
      function get(data: Record<any, any>) {
        let i = 0
        const len = data.length
        while (i < len) {
          const item = data[i]
          const key = item[_.keyField]
          if (key == k) {
            arr = item[_.childField]
            break
          } else {
            if (item[_.childField]) {
              get(item[_.childField])
            }
          }
          i++
        }
      }
      if (current.value) {
        if (indexPath === 1) {
          return current.value[_.childField]
        }
        get(current.value[_.childField])
      }
      return arr
    }

    function renderList(indexPath: number) {
      let data: Record<any, any>[] | null | undefined = _.data
      if (indexPath !== 0) {
        const parentIndex = indexPath - 1
        const k = path.value[parentIndex][_.keyField]
        // console.log(path.value[parentIndex][_.textField])
        data = findDetailByKey(k, indexPath)
      }
      if ((data && data.length === 0) || !data) {
        return null
      }
      const listOptions = {
        data,
        checkable: _.checkable,
        activable: (item: Record<any, any>) => {
          if (path.value[indexPath])
            return isSameItem(item, path.value[indexPath])
        },
        keyField: _.keyField,
        textField: _.textField,
        class: 'w-cascade-list',
        itemClass: 'w-list-item-between',
        onToggle: (item: Record<any, any>, index: number) => {
          const _item = { ...item }
          if (indexPath === 0) {
            const one = path.value[0]
            if (one) {
              if (!isSameItem(item, one)) {
                path.value = [_item]
              }
            } else {
              path.value.push(_item)
            }
          } else {
            const curItem = path.value[indexPath]
            if (curItem) {
              if (!isSameItem(item, curItem)) {
                path.value = path.value.slice(0, indexPath).concat([_item])
              }
            } else {
              path.value.push(_item)
            }
          }
        }
      }
      const listSlots = {
        default: ({ item }: { item: Record<any, any> }) => {
          return (
            <>
              <span>{item[_.textField]}</span>
              {item[_.childField] && item[_.childField].length > 0 && (
                <Icon
                  name="w-icon-arrow-down"
                  rotate={true}
                  deg={-90}
                  direction={'z'}
                />
              )}
            </>
          )
        }
      }
      return <List {...listOptions} v-slots={listSlots} />
    }
    watch(
      () => _.show,
      (v: boolean) => {
        visible.value = v
      }
    )
    watch(visible, (v: boolean) => {
      emit('update:show', v)
    })
    watch(
      () => _.modelValue,
      (a: Record<any, any>[]) => {
        path.value = a
      }
    )
    watch(path, (a: Record<any, any>[]) => {
      emit('update:modelValue', a)
    })

    return () => {
      const layerSlots = {
        trigger: () => <Trigger {...triggerOptions.value} />,
        default: () => {
          return [
            renderList(0),
            path.value.map((item, index, arr) => {
              return renderList(index + 1)
            })
          ]
        }
      }
      return <Layer {...layerOptions.value} v-slots={layerSlots} />
    }
  }
})
