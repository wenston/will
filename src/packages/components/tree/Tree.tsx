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
import Checkbox from '../../components/checkbox'

import type { IconType } from '../../components/icon/Icon'
import { TreeDefaultSlotOptions } from '../../components/virtual/Virtual'
import type { TreeDataType } from '../../components/virtual/Virtual'
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
  },
  //复选相关参数
  hasCheckbox: { type: Boolean, default: true },
  rows: Array,
  keys: { type: Array, default: () => [] },
  rule: {
    type: String,
    default: 'some'
  }
}
const TreeEmits = ['update:modelValue', 'update:keys']
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
    const { filterPlattenData, toggle,toSelectParent,toSelectChildren } = usePlatData(
      computed(() => props.data),
      props.keyField,
      props.childField,
      props.levelField,
      stateMap,
      getState,
      setState,
      props.rule,
      props.onlyOne,
      computed(()=>props.keys)
    )
    function renderIndent(item: Record<any, any>) {
      let space = []
      let i = 0
      while (i < item[props.levelField] - 1) {
        space.push(<span class="w-no-select">&#12288;&nbsp;&nbsp;</span>)
        i++
      }
      return space
    }
    function renderIcon(item: Record<any, any>, index: number) {
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

    function renderCheckbox(item: Record<any, any>, index: number) {
      if (props.hasCheckbox) {
        const checkboxOptions: EmptyObject = {
          value: item[props.keyField],
          modelValue: props.keys,
          'onUpdate:modelValue': (v: any[]) => {
            ctx.emit('update:keys', v)
          },
          onChange: (b: boolean) => {
            // console.log(b)
            //选择时，要处理树形数据中当前数据的上下级，做同步选择
            onSelectParentAndChildren(b, item,index)
          },
          onClick: (e: MouseEvent) => {
            e.stopPropagation()
          }
        }
        return <Checkbox {...checkboxOptions} />
      }
    }

    //同步选择当前数据的上下级
    function onSelectParentAndChildren(b:boolean,item:Record<any,any>,index:number) {
      const {shouldDeleteKeys:d,shouldSelectedKeys:s} = toSelectChildren(b,item,index)
      const {shouldDeleteKeys,shouldSelectedKeys} = toSelectParent(b,item,index)
      const selectedKeys = [...s,...shouldSelectedKeys]
      const deletedKeys = [...d,...shouldDeleteKeys]
      // console.log(deletedKeys)
      if(deletedKeys?.length) {
        // console.log(deletedKeys)
        deleteKeys(deletedKeys)
        
      }
      if(selectedKeys?.length) {
        addKeys(selectedKeys)
      }
    }

    function getRows() {
      
    }

    function addKeys(keys:any[]) {
      const ks =  [...new Set([...props.keys,...keys])]
      // console.log(props.keys,keys)
      ctx.emit('update:keys', ks)
    }

    function deleteKeys(keys:any[]) {
      const set = new Set(props.keys)
      // console.log(set,keys)
      keys.forEach(k=>{
        set.delete(k)
      })
      ctx.emit('update:keys',[...set])
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
                  //向组件外抛出事件
                }}>
                {renderIndent(item)}
                {renderIcon(item, realIndex)}
                {renderCheckbox(item, realIndex)}
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
        sourceData: filterPlattenData.value,
        itemHeight: props.itemHeight,
        ...ctx.attrs
      }
      return (
        <>
          <Virtual {...virtualOptions} v-slots={treeSlots} />
          {ctx.slots.use?.({
            filterPlattenData: readonly(filterPlattenData.value),
            current: readonly(current)
          })}
        </>
      )
    }
  }
})
