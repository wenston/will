import {
  defineComponent,
  ref,
  shallowReactive,
  computed,
  renderSlot,
  provide,
  readonly,
  watchEffect,
  useAttrs
} from 'vue'
import type { ComputedRef, PropType } from 'vue'

import { EmptyObject } from '../../config/types'
import Virtual from '../../components/virtual'
import Icon from '../../components/icon'
import type { IconType } from '../../components/icon/Icon'
import { TreeDefaultSlotOptions } from '../../components/virtual/Virtual'
import type { TreeDataType } from '../../components/virtual/Virtual'
import { plattenTreeNode } from '../../util'
import usePlatData from './_use/platTreeData'
import useTreeState from './_use/treeState'

export type TreeIconsType = IconType[]

export const TreeProps = {
  data: {
    type: Array as PropType<TreeDataType>,
    default: () => []
  },
  //每一行节点的高度
  itemHeight: {
    type: Number,
    default: 30
  },
  keyField: {
    type: String,
    default: 'Id'
  },
  textField: {
    type: String,
    default: 'Name'
  },
  childField: {
    type: String,
    default: 'Childs'
  },
  levelField: {
    type: String,
    default: 'Levels'
  },
  //每一行节点前的图标
  icons: {
    type: Array as PropType<TreeIconsType>,
    default: () => [
      { name: 'w-icon-folder' },
      { name: 'w-icon-folder-open' },
      { name: 'w-icon-file', color: 'var(--w-color-font-4)' }
    ]
  },
  //层级展开互斥，也就是这个节点展开后，同级其他节点要折叠
  onlyOne: {
    type: Boolean,
    default: true
  }
}
const TreeEmits = ['update:modelValue']
export default defineComponent({
  inheritAttrs: false,
  components: { Virtual },
  props: TreeProps,
  emits: TreeEmits,
  setup(props, ctx) {
    //当前操作（点击、折叠、展开）的节点
    const current = shallowReactive<{
      item: EmptyObject | null
      index: number
    }>({ item: null, index: -1 })
    const { stateMap, setState, getState } = useTreeState(props.onlyOne)
    const { platData, toggle } = usePlatData(
      computed(() => props.data),
      props.keyField,
      props.childField,
      props.levelField,
      stateMap,
      getState,
      setState,
      current,
      props.onlyOne
    )
    function renderIdent(item: EmptyObject) {
      let space = []
      let i = 0
      while (i < item[props.levelField] - 1) {
        space.push(<span class="w-no-select">&#12288;</span>)
        i++
      }
      return space
    }
    function renderIcon(item: EmptyObject, index: number) {
      if (item[props.childField] && item[props.childField].length) {
        const iconSize: string = props.icons[0].size || '15px'
        return (
          <span
            class="w-tree-item-icon w-cursor-pointer"
            onClick={(e: MouseEvent) => {
              toggle(item, index)
              e.stopPropagation()
            }}>
            {props.icons[0].name && (
              <Icon name={props.icons[0].name} size={iconSize} />
            )}
          </span>
        )
      } else {
        const iconSize: string = props.icons[2].size || '15px'
        return (
          <span class="w-tree-item-icon">
            {props.icons[2].name && (
              <Icon
                name={props.icons[2].name}
                color={props.icons[2].color}
                size={iconSize}
              />
            )}
          </span>
        )
      }
    }

    return () => {
      const treeSlots = {
        default: ({
          data: visibleData,
          index: { from, to },
          scrollTo
        }: TreeDefaultSlotOptions) => {
          return visibleData.map((item: EmptyObject, i: number) => {
            const realIndex: number = from + i
            const key = item[props.keyField]
            return (
              <div
                key={key}
                class={[
                  'w-tree-item',
                  {
                    ['w-tree-item-current']: current.item
                      ? current.item[props.keyField] === key
                      : false
                  }
                ]}
                style={{ height: props.itemHeight + 'px' }}
                onClick={(e: MouseEvent) => {
                  current.item = item
                  current.index = realIndex
                }}>
                {renderIdent(item)}
                {renderIcon(item, realIndex)}
                {ctx.slots.default ? (
                  renderSlot(ctx.slots, 'default', {
                    row: item,
                    index: realIndex
                  })
                ) : (
                  <span>{item[props.textField]}</span>
                )}
              </div>
            )
          })
        }
      }
      const virtualOptions = {
        sourceData: platData.value,
        itemHeight: props.itemHeight,
        ...ctx.attrs
      }
      return (
        <>
          <Virtual {...virtualOptions} v-slots={treeSlots} />
          {ctx.slots.use?.({
            platData: readonly(platData.value),
            current: readonly(current)
          })}
        </>
      )
    }
  }
})
