import { defineComponent, computed, inject, ComputedRef } from 'vue'
import Cell from './_cell'
import { IS_INDEX, IS_PRESET } from './_use'
import { getAlign } from './_util'
export default defineComponent({
  components: { Cell },
  props: {
    hasSum: Boolean,
    columns: Array,
    data: Array
  },
  setup(props) {
    const _leftFixed = computed(() => {
      const l = inject('leftFixed') as ComputedRef<string | number>
      if (l.value) {
        return Number(l.value)
      }
      return 0
    })
    function renderTd() {
      return props.columns?.map((col: any, i) => {
        let cont = null
        if (col.sum !== false && col.sum !== undefined) {
          let t = 0
          props.data?.forEach((item: any) => {
            let n = item[col.field] - 0
            t += n
          })
          if (typeof col.sum === 'function') {
            cont = col.sum(t)
          } else {
            cont = t
          }
        }

        const tdProps: any = {
          class: [{ 'w-cell--sticky': _leftFixed.value > i }],
          tag: 'th',
          align: getAlign(col)?.tfoot
        }
        if (IS_PRESET(col.field)) {
          tdProps.align = 'center'
          tdProps.isNarrow = true
          if (IS_INDEX(col.field)) {
            cont = '合计'
          }
        }
        return <Cell {...tdProps}>{cont}</Cell>
      })
    }
    return () => {
      if (props.hasSum) {
        return <tr>{renderTd()}</tr>
      }
    }
  }
})
