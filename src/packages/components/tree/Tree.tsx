import { ComputedRef, PropType, watch } from 'vue'
import { defineComponent, ref, computed, watchEffect } from 'vue'
import { EmptyObject } from '../../config/types'
import Virtual from '../../components/virtual'
import { TreeDefaultSlotOptions } from '../../components/virtual/Virtual'
import type { TreeDataType } from '../../components/virtual/Virtual'
import { plattenTreeNode } from '../../util'

export const TreeProps = {
  data: {
    type: Array as PropType<TreeDataType>,
    default: () => []
  },
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
  }
}
export default defineComponent({
  components: { Virtual },
  props: TreeProps,
  emits: [],
  setup(props, ctx) {
    const treeData = ref<EmptyObject>([])
    function renderIdent(row: EmptyObject) {
      let space = []
      let i = 0
      while (i < row[props.levelField]) {
        space.push(<span>&#12288;</span>)
        i++
      }
      return space
    }
    function renderIcon(row: EmptyObject, index: number) {
      if (row[props.childField] && row[props.childField].length) {
        return <span onClick={(e: MouseEvent) => {}}>+</span>
      }
    }

    watch(
      () => props.data,
      (d) => {
        treeData.value = plattenTreeNode<EmptyObject>(d, props.childField)
      }
    )

    return () => {
      const treeSlots = {
        default: ({
          data: visibleData,
          index: { from, to }
        }: TreeDefaultSlotOptions) => {
          return visibleData.map((row: EmptyObject, i: number) => {
            return (
              <div class={['w-tree-item']}>
                {renderIdent(row)}
                {renderIcon(row, i + from)}
                <span>{row[props.textField]}</span>
              </div>
            )
          })
        }
      }
      return (
        <Virtual
          source-data={props.data}
          item-height={props.itemHeight}
          v-slots={treeSlots}
        />
      )
    }
  }
})
