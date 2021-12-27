import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
  toRefs,
  provide,
  readonly,
  getCurrentInstance,
  nextTick
} from 'vue'
import useDelay from '../../use/useDelay'
import useToggleArray from '../../use/toggle/useToggleArray'
import { getBoundingClientRect, hasUnit } from '../../util'
import Thead from './_thead'
import Tbody from './_tbody'
import Tfoot from './_tfoot'
import _props from './_props'
import { useTdWidth, useColumns, useFixed } from './_use'
import { createTbodyColumns, getSelectedKey } from './_util'
const MIN_WIDTH = 32 //调整列宽时，最小允许的宽度
const EMITS = [
  'update:modelValue',
  'update:keys',
  'after-checked',
  'update:highlight',
  'sort'
]
const TBODYEMITS = ['add', 'delete']
type TbodyEmits = 'add' | 'delete'
interface SorterType {
  field: string
  sorter: boolean | number
}

export default defineComponent({
  components: { Thead, Tbody, Tfoot },
  props: _props,
  emits: [...EMITS, ...TBODYEMITS],
  setup(props, { emit, attrs, slots }) {
    const resizeWidths = new Map<object, number>()
    // const ins = getCurrentInstance()
    // console.time(String(ins?.uid))
    const resizing = ref(false)
    const resizeLineLeft = ref(-10000)
    const oldResizeLineLeft = ref(-10000)
    const currentSorter = reactive<SorterType>({ field: '', sorter: true })
    const { set, get, toggle } = useToggleArray([true, 0, 1], {
      item: true
    })

    const isCheckedAll = ref(0)
    const selectedKeys = ref<any[]>([])
    const tableRoot = ref()
    const tableRootLeft = ref(0)
    const inner = ref()
    const innerProps = computed(() => {
      let o: any = {
        ref: inner,
        class: [
          'w-sheet-inner-container',
          'w-sheet--min-content',
          {
            'w-sheet--nowrap': props.nowrap,
            'w-sheet--stripe': props.stripe,
            'w-sheet--hover': props.hover,
            'w-sheet--has-action': props.hasAction,
            'w-sheet--has-top-shadow': showTopShadow.value,
            'w-sheet--has-bottom-shadow': showBottomShadow.value
          }
        ],
        style: {
          height: props.height,
          maxHeight: props.maxHeight
        }
      }
      return o
    })
    //columns参数传入之后，加入预置列, 序列号、多选框、单选框
    const finalColumns = useColumns(
      computed(() => props.columns),
      computed(() => ({
        indexContent: props.indexContent,
        hasIndex: props.hasIndex,
        hasCheckbox: props.hasCheckbox,
        checkKey: props.checkKey,
        hasRadio: props.hasRadio,
        hasAction: props.hasAction
      }))
    )
    const tbodyColumns = computed(() => createTbodyColumns(finalColumns.value))
    const hasSum = computed(() => {
      let has = false
      let i = 0
      let len = tbodyColumns.value.length
      while (i < len) {
        const col = tbodyColumns.value[i]
        if (col.sum !== false && col.sum !== undefined) {
          has = true
          break
        }
        i++
      }
      // console.log(has)
      return has
    })
    const {
      showLeftShadow,
      showRightShadow,
      leftShadowPosition,
      rightShadowPosition,
      showTopShadow,
      showBottomShadow,
      reset
    } = useFixed(
      tableRoot,
      inner,
      computed(() => props.leftFixed),
      computed(() => props.rightFixed),
      hasSum
    )

    const theadProps = computed(() => {
      let o: any = {
        totalTbodyColumns: tbodyColumns.value.length,
        columns: finalColumns.value,
        indexContent: props.indexContent,
        checkKey: props.checkKey,
        resize: props.resize
      }
      return o
    })
    const tbodyProps = computed(() => {
      let o: any = {
        columns: tbodyColumns.value,
        data: props.data,
        hasIndex: props.hasIndex,
        hasAction: props.hasAction,
        pageSize: props.pageSize,
        pageIndex: props.pageIndex,
        tbodySlots: slots,
        hasCheckbox: props.hasCheckbox,
        hasRadio: props.hasRadio,
        checkKey: props.checkKey,
        isCheckedAll: isCheckedAll.value,
        checkable: props.checkable,
        canHighlight: props.canHighlight,
        highlightKey: props.highlightKey
      }
      return o
    })
    const tfootProps = computed(() => {
      let o: any = {
        hasSum: hasSum.value,
        columns: tbodyColumns.value,
        data: props.data
      }
      return o
    })

    const { tdWidths } = useTdWidth(
      computed(() => props.autoWidth),
      inner,
      tbodyColumns
    )

    //子组件通过一个方法发射事件
    provide('toEmit', (eventName: TbodyEmits, ...opts: any) => {
      emit(eventName, ...opts)
    })

    //单选
    provide('modelValue', readonly(computed(() => props.modelValue)))
    provide('updateModelValue', (k: number | string) => {
      emit('update:modelValue', k)
    })

    //复选
    provide('isCheckedAll', readonly(isCheckedAll))
    //thead中使用
    provide('setCheckAll', setCheckAll)

    provide('selectedKeys', readonly(selectedKeys))
    provide('hasKey', (k: any) => {
      return selectedKeys.value.some((sv) => sv === k)
    })
    provide('toggleSelect', (k: any, checked: boolean) => {
      if (checked) {
        selectedKeys.value = selectedKeys.value.filter((el) => el !== k)
      } else {
        selectedKeys.value.push(k)
      }
      let b = checkAllSelected()
      isCheckedAll.value = b
      afterChecked()
    })
    //高亮
    provide('highlight', readonly(computed(() => props.highlight)))
    provide('toggleHighlight', (v: number | string) => {
      emit('update:highlight', v)
    })
    //左右固定列
    provide('leftFixed', readonly(computed(() => props.leftFixed)))
    provide('rightFixed', readonly(computed(() => props.rightFixed)))

    //列宽调整
    //给组件根节点添加w-no-select的class，以免在拖拽时选择了文本
    provide('beforeResize', (tdElem: HTMLElement) => {
      resizing.value = true
      tableRoot.value.classList.add('w-no-select')
      //记录tableRoot在页面中的left
      tableRootLeft.value = getBoundingClientRect(tableRoot.value).left
      const tdRight = getBoundingClientRect(tdElem).right
      const x = tdRight ?? 0
      resizeLineLeft.value = x - 1 - tableRootLeft.value
      oldResizeLineLeft.value = resizeLineLeft.value
    })
    provide('inResizing', (colIndex: number, dx: number = 0) => {
      resizeLineLeft.value = dx + oldResizeLineLeft.value
    })
    //dWidth是增或减的宽
    provide('afterResize', (colIndex: number, dWidth: number) => {
      // const old_width = resizeWidths.value[colIndex]
      resizing.value = false
      tableRoot.value.classList.remove('w-no-select')
      resizeLineLeft.value = -10000
      if (dWidth === 0) {
        return
      }
      const k = tbodyColumns.value[colIndex]
      const oldWidth = resizeWidths.has(k)
        ? resizeWidths.get(k)
        : tdWidths.value[colIndex]
      let newWidth = oldWidth + dWidth
      if (newWidth <= MIN_WIDTH) {
        newWidth = MIN_WIDTH
      }
      resizeWidths.set(tbodyColumns.value[colIndex], newWidth)
      //重新定位固定列的阴影位置
      if (!!props.leftFixed || !!props.rightFixed) {
        let n = Number(props.leftFixed) ?? 0
        let rightN = Number(props.rightFixed) ?? 0
        if ((n > 0 && colIndex < n) || rightN > 0) {
          reset()
        }
      }
    })

    //排序
    provide('currentSorter', readonly(currentSorter))
    provide('updateSorter', (field: string) => {
      if (field === currentSorter.field) {
        currentSorter.sorter = toggle().item!
      } else {
        currentSorter.field = field
        set({ item: 0 })
        currentSorter.sorter = get().item!
      }
      // console.log(currentSorter)
      emit('sort', currentSorter)
    })

    function colGroup(widths: number[]) {
      return (
        <colgroup>
          {widths.map((w: any, i: number) => {
            const k = tbodyColumns.value[i]
            const has = resizeWidths.has(k)

            const ww = has ? resizeWidths.get(k) : w
            return <col style={{ width: ww + 'px' }} />
          })}
        </colgroup>
      )
    }

    function setCheckAll(b: number) {
      isCheckedAll.value = b
      if (b) {
        if (props.data && props.data.length) {
          ;(props.data as any).forEach((row: any, index: number) => {
            if (props.checkable) {
              const { disabled } = props.checkable(row, index)
              if (!disabled) {
                selectedKeys.value.push(getSelectedKey(row, props.checkKey))
              }
            } else {
              selectedKeys.value.push(getSelectedKey(row, props.checkKey))
            }
          })
        }
      } else {
        selectedKeys.value = []
      }
      afterChecked()
    }
    //可以复选时，检查是否所有行都被选中了
    function checkAllSelected() {
      const keys = selectedKeys.value
      const d = (props.data ?? []).filter((row: any, index: number) => {
        if (props.checkable) {
          const { disabled } = props.checkable(row, index)
          return !disabled
        }
        return true
      })
      if (d && d.length && keys.length) {
        let checked = 1

        if (d.length <= keys.length) {
          let i = 0
          while (i < d.length) {
            const row = d[i]
            const k = getSelectedKey(row, props.checkKey)
            if (!keys.some((_k) => _k == k)) {
              checked = 0
              break
            }
            i++
          }
        } else {
          checked = 0
        }
        return checked
      }
      return 0
    }

    function afterChecked() {
      let arr = (props.data ?? []).filter((row, index) => {
        const k = getSelectedKey(row, props.checkKey)
        if (props.checkable) {
          const { disabled } = props.checkable(row, index)
          if (!disabled) {
            return selectedKeys.value.some((s) => s == k)
          }
          return false
        }
        return selectedKeys.value.some((s) => s == k)
      })
      emit('after-checked', arr)
    }

    watch(
      selectedKeys,
      (ks) => {
        if (!isSameArray(ks, props.keys as any)) {
          emit('update:keys', ks)
        }
      },
      { deep: true }
    )
    watch(
      () => props.keys,
      (ks: any) => {
        if (!isSameArray(ks, selectedKeys.value)) {
          selectedKeys.value = ks
        }
      },
      { deep: true, immediate: true }
    )
    watch(tbodyColumns, () => {
      nextTick(reset)
    })

    onMounted(() => {
      //刷新页面时，FF浏览器会记录滚动条的位置，故在此重置为0
      //不管三七二十一，全部重置
      inner.value.scrollLeft = 0
      inner.value.scrollTop = 0
      // console.timeEnd(String(ins?.uid))
    })
    return () => {
      const thead = <Thead {...theadProps.value}></Thead>
      const tbody = <Tbody {...tbodyProps.value}></Tbody>

      return (
        <div class="w-sheet-container" ref={tableRoot}>
          <div {...innerProps.value}>
            <div class="w-sheet-thead">
              <table class="w-sheet">
                {colGroup(tdWidths.value)}
                <thead>{thead}</thead>
              </table>
            </div>
            <div class="w-sheet-tbody">
              <table class="w-sheet">
                {colGroup(tdWidths.value)}
                <tbody>{tbody}</tbody>
              </table>
            </div>
            {hasSum.value && (
              <div class="w-sheet-tfoot">
                <table class="w-sheet">
                  {colGroup(tdWidths.value)}
                  <tfoot>
                    <Tfoot {...tfootProps.value} />
                  </tfoot>
                </table>
              </div>
            )}
          </div>
          <div
            class="w-sheet-resize-line"
            v-show={resizing.value}
            style={{ left: resizeLineLeft.value + 'px' }}></div>
          <div
            class="w-sheet-left-fixed-shadow-line"
            v-show={!!props.leftFixed && showLeftShadow.value}
            style={{ left: leftShadowPosition.value + 'px' }}
          />
          <div
            class="w-sheet-right-fixed-shadow-line"
            v-show={!!props.rightFixed && showRightShadow.value}
            style={{ left: rightShadowPosition.value + 'px' }}
          />
        </div>
      )
    }
  }
})

// 两个数组
function isSameArray(arr1: any[], arr2: any[]) {
  if (arr1.length === arr2.length) {
    if (arr1.length === 0) {
      return true
    }
    let i = 0
    let b = true
    while (i < arr1.length) {
      const k = arr1[i]
      if (!arr2.some((item) => item === k)) {
        b = false
        break
      }
      i++
    }
    return b
  }
  return false
}
