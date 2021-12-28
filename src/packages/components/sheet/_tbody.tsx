import { computed, defineComponent, ref, Ref, inject, ComputedRef } from 'vue'
import Cell from './_cell'
import Icon from '../icon/index'
import { IS_PRESET, IS_CHECKBOX, IS_INDEX, IS_RADIO } from './_use'
import { getAlign, getSelectedKey } from './_util'
export default defineComponent({
  name: 'SheetTbody',
  components: { Cell, Icon },
  props: {
    columns: Array,
    data: Array,
    from: Number,
    to: Number,
    hasIndex: Boolean,
    hasAction: [Boolean, Array, String],
    pageIndex: { type: [String, Number] },
    pageSize: { type: [String, Number] },
    tbodySlots: Object,
    checkKey: String,
    hasCheckbox: Boolean,
    hasRadio: Boolean,
    isCheckedAll: Number, //0,1
    checkable: Function,
    canHighlight: Boolean,
    highlightKey: String
  },
  setup(props, { emit, attrs }) {
    const toEmit = inject('toEmit') as Function
    const modelValue = inject('modelValue') as ComputedRef<string | number>
    const updateModelValue = inject('updateModelValue') as Function
    // const isCheckedAll = inject("isCheckedAll") as Ref<number>
    // const selectedKeys = inject("selectedKeys") as Ref<string[]>
    const toggleSelect = inject('toggleSelect') as Function
    const hasKey = inject('hasKey') as Function
    const highlight = inject('highlight') as ComputedRef<string | number>
    const toggleHighlight = inject('toggleHighlight') as Function
    const total = ref<number[]>([])
    const pi = computed(() => (props.pageIndex ? Number(props.pageIndex) : 0))
    const ps = computed(() => (props.pageSize ? Number(props.pageSize) : 0))
    const hasAddAction = computed(() => {
      const a = props.hasAction
      if (a) {
        return (
          a === 'add' ||
          a === true ||
          (Array.isArray(a) && a.indexOf('add') > -1)
        )
      }
    })
    const hasDeleteAction = computed(() => {
      const a = props.hasAction
      if (a) {
        return (
          a === 'delete' ||
          a === true ||
          (Array.isArray(a) && a.indexOf('delete') > -1)
        )
      }
    })
    //row是一行数据，col是columns里的其中一列, index是第几行
    function renderTd(
      row: any,
      col: any,
      index: number,
      iCol: number,
      checked: boolean,
      isChecked: boolean,
      disabled: boolean
    ) {
      const tdProps: any = {
        align: getAlign(col)?.tbody,
        colIndex: iCol
      }
      let cont: any
      //处理预置列
      if (IS_PRESET(col.field)) {
        tdProps.align = 'center'
        tdProps.isNarrow = true
        if (IS_PRESET(col.field)) {
          const isCheckbox = IS_CHECKBOX(col.field)
          const isRadio = IS_RADIO(col.field)

          if (IS_INDEX(col.field)) {
            cont = index + 1
            if (pi.value && ps.value) {
              cont = ps.value * (pi.value - 1) + cont
            }
            if (props.from !== undefined) {
              cont = cont + props.from
            }
            if (props.hasAction) {
              const actionSlot =
                props.tbodySlots &&
                props.tbodySlots.action &&
                props.tbodySlots.action({ row, index })
              const addProps = {
                name: 'w-icon-add',
                class: 'w-cell-action-add',
                onClick: (e: MouseEvent) => {
                  toEmit('add', row, index)
                  e.stopPropagation()
                }
              }
              const deleteProps = {
                name: 'w-icon-delete',
                class: 'w-cell-action-delete',
                onClick: (e: MouseEvent) => {
                  toEmit('delete', row, index)
                  e.stopPropagation()
                }
              }
              const actionContent = actionSlot ?? [
                hasAddAction.value && <Icon {...addProps} />,
                hasDeleteAction.value && <Icon {...deleteProps} />
              ]
              cont = [
                <div class="w-cell-index">{cont}</div>,
                <span>&#12288;</span>,
                <div class="w-cell-action">{actionSlot ?? actionContent}</div>
              ]
            }
          } else if (isCheckbox || isRadio) {
            let iconName = isCheckbox ? 'w-icon-checkbox' : 'w-icon-radio'
            if (checked || (isChecked && disabled)) {
              iconName = isCheckbox
                ? 'w-icon-checkbox-fill'
                : 'w-icon-radio-fill'
            }
            if (disabled && !isChecked) {
              iconName = isCheckbox ? 'w-icon-square' : 'w-icon-ball'
            }
            cont = (
              <Icon
                name={iconName}
                class={[
                  'w-sheet-check-icon',
                  {
                    'w-sheet-check-icon--checked': checked || isChecked,
                    'w-sheet-check-icon--disabled': disabled
                  }
                ]}
              />
            )
          }
        }
      } else if (col.render) {
        cont = col.render(row, index)
      } else if (col.slot) {
        if (props.tbodySlots && props.tbodySlots[col.slot]) {
          cont = props.tbodySlots[col.slot]({ row, index })
        }
      } else if (col.field) {
        cont = row[col.field]
      }

      return <Cell {...tdProps}>{cont}</Cell>
    }

    function renderTr(row: any, index: number) {
      const trProps: any = {}
      let checkValue = ''
      let hValue: number | string
      let checked = false
      let isChecked = false
      let disabled = false
      if (props.hasRadio || props.hasCheckbox || props.canHighlight) {
        checkValue = getSelectedKey(row, props.checkKey ?? 'Id')
        hValue = getSelectedKey(row, props.highlightKey ?? 'Id')
        checked = props.hasCheckbox
          ? hasKey(checkValue)
          : checkValue == modelValue.value
        const isHigh = props.canHighlight && hValue == highlight.value
        trProps.class = {
          'w-sheet-tr--checked': checked,
          'w-sheet-tr--highlight': isHigh
        }
        if (props.checkable) {
          ;({ checked: isChecked, disabled } = props.checkable(row, index))
        }
        if (!disabled) {
          trProps.onClick = () => {
            if (props.hasCheckbox) {
              toggleSelect(checkValue, checked)
            } else if (props.hasRadio) {
              if (!checked) {
                updateModelValue(checkValue)
              }
            }
            if (props.canHighlight && !isHigh) {
              toggleHighlight(hValue)
            }
          }
        }
      }

      const tds = (props.columns ?? []).map((col: any, iCol: number) => {
        //isChecked是在disabled时用的
        return renderTd(row, col, index, iCol, checked, isChecked, disabled)
      })
      return <tr {...trProps}>{tds}</tr>
    }
    function renderBody() {
      total.value = []
      return (props.data ?? []).map((row, i) => {
        return renderTr(row, i)
      })
    }
    return () => {
      return renderBody()
    }
  }
})
