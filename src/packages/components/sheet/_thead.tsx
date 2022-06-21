import {
  defineComponent,
  ref,
  inject,
  Ref,
  ComputedRef,
  computed,
  reactive
} from 'vue'
import Cell from './_cell'
import Checkbox from '../checkbox/index'
import Radio from '../radio/index'
import { IS_PRESET, IS_CHECKBOX, IS_INDEX, IS_RADIO } from './_use'

export default defineComponent({
  name: 'SheetThead',
  components: { Cell, Checkbox, Radio },
  props: {
    totalTbodyColumns: { type: Number, default: 0 },
    //columns是加工处理过的
    columns: Array,
    indexContent: [String, Object],
    checkKey: String,
    radioKey: String,
    hasAction: Boolean,
    resize: Boolean
  },
  setup(props, { attrs, emit, slots }) {
    const isCheckedAll = inject('isCheckedAll') as Ref<number>
    const setCheckAll = inject('setCheckAll') as Function

    const _leftFixed = computed(() => {
      const l = inject('leftFixed') as ComputedRef<string | number>
      if (l.value) {
        return Number(l.value)
      }
      return 0
    })
    const _rightFixed = computed(() => {
      const r = inject('rightFixed') as ComputedRef<string | number>
      if (r.value) {
        return Number(r.value)
      }
      return 0
    })

    function getRowspan(obj: any, max: number) {
      if (obj.children && obj.children.length !== 0) {
        return 1
      }
      return max - obj.__level
    }
    function getColspan(obj: any) {
      let arr = [],
        fn = (obj: any) => {
          if (obj.children && obj.children.length) {
            obj.children.forEach((c: any) => {
              fn(c)
            })
          } else {
            arr.push(obj)
          }
        }
      fn(obj)
      return arr.length || 1
    }

    function renderTableHead() {
      let colIndex = 0
      //预置列数
      let presets = 0
      let columns = props.columns ?? []
      //记录总共行数
      let maxRowLength = 0
      //记录单元格序列号
      let __index = 0
      //标记每一行数据
      /**
       * addIndex，给每列添加一个index，对应col的序列
       *
       */
      let addIndex = (col: any, colChildren: any) => {
        if (colChildren.children && colChildren.children.length) {
          col.__index = col.__index + colChildren.children.length - 1
          colChildren.children.forEach((c: any) => {
            addIndex(col, c)
          })
        }
      }
      //addLevel标记层级，方便合并行和列
      let addLevel = (cols: any, i: number) => {
        cols.forEach((col: any) => {
          // if (this.$_is_built_in_column(col.field)) {
          //   presets += 1
          // }
          //__level代表了第几行tr
          col.__index = __index++
          col.__level = i
          if (maxRowLength < i) {
            maxRowLength = i
          }
          if (col.children && col.children.length) {
            // col.__index = col.__index + col.children.length - 1
            addIndex(col, col)
            __index--
            addLevel(col.children, col.__level + 1)
          }
        })
      }
      //给数据添加行编号，方便后续循环时将单元格插入对应的行
      addLevel(columns, 0)
      //由于行号时从0开始的，所以要加1
      maxRowLength += 1
      //预先创建好所有的行
      let trs: any[][] = Array.apply(null, {
        length: maxRowLength
      } as any).map(() => [])

      let renderTd = (columns: any[]) => {
        columns.forEach((col, i, arr) => {
          const isPreset = IS_PRESET(col.field) //this.$_is_built_in_column(col.field)
          let content = null
          // console.log(col.name , typeof col.name)
          if (typeof col.name === 'function') {
            content = col.name()
          } else {
            content = col.name
          }

          if (isPreset) {
            if (IS_INDEX(col.field)) {
              content = props.indexContent
            }
            // if (this.hasAction && col.field === this.__action) {
            //   content = "操作"
            // }
            if (IS_CHECKBOX(col.field)) {
              const checkboxProps = {
                iconSize: '16px',
                // iconColor: 'var(--w-color-font-3)',
                modelValue: isCheckedAll.value,
                'onUpdate:modelValue': (v: number) => {
                  setCheckAll(v)
                }
              }
              content = <Checkbox {...checkboxProps} />
            } else if (
              IS_RADIO(col.field) /*  && col.field === this.__radio */
            ) {
              content = ''
            }
          }

          const colspan = getColspan(col)
          const rowspan = getRowspan(col, maxRowLength)

          const cellProps = {
            isInThead: true,
            colspan,
            rowspan,
            notBold: isPreset,
            isNarrow: isPreset,
            align: isPreset || colspan > 1 ? 'center' : '',
            resizeWidth: props.resize && colspan == 1,
            colIndex: colspan == 1 ? colIndex : undefined,
            tag: 'th',
            sorter: (() => {
              let b = undefined
              if ('field' in col && 'sorter' in col) {
                b = col.sorter
              }
              return b
            })(),
            col,
            // sorter: (() => {
            //   let b = true;
            //   if (col.field && this.currentSorterField == col.field) {
            //     b = this.currentSort
            //   } else {
            //     b = "sorter" in col
            //   }
            //   return b
            // })()

            class: [
              {
                'w-cell--sticky':
                  _leftFixed.value > colIndex ||
                  _rightFixed.value > props.totalTbodyColumns - colIndex - 1
              }
              /* [
                      col.cellClass
                        ? this.$_get_td_class(null, null, col, { thead: true })
                        : ""
                    ] */
            ]
            //   style: this.$_get_td_style(null, null, col, { thead: true }),
          }

          //如果有children，说明有列合并
          // trs[col.__level].push(<Cell {...cellProps}>{content}</Cell>);
          const _con = <Cell {...cellProps}>{content}</Cell>
          trs[col.__level].push(_con)
          if (colspan == 1) {
            colIndex += 1
          }
          if (col.children && col.children.length) {
            renderTd(col.children)
          }
        })
      }
      renderTd(columns)
      return trs.map((tr) => <tr>{tr}</tr>)
    }

    return () => {
      return renderTableHead()
    }
  }
})
