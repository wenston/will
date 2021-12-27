import {
  ComputedRef,
  Ref,
  computed,
  ref,
  watch,
  onUpdated,
  nextTick,
  onMounted
} from 'vue'
// import { isObject, isFunction } from "@vue/shared"
import { isObject, isFunction } from '../../util'
import {
  toPX,
  hasUnit,
  getUnit,
  getStyle,
  getElement,
  getBoundingClientRect
} from '../../util'
import useEvent from '../../use/useEvent'
import useDelay from '../../use/useDelay'
import useScroll from '../../use/useScroll'

const PRESET_INDEX = '__preset_index__'
const PRESET_CHECKBOX = '__preset_checkbox__'
const PRESET_RADIO = '__preset_radio__'
const PRESET_ACTION = '__preset_action__'

export const PRESET_FIELDS: { [key: string]: any } = {
  index: { field: PRESET_INDEX, style: { width: 40 } },
  checkbox: { field: PRESET_CHECKBOX, style: { width: 40 } },
  radio: { field: PRESET_RADIO, style: { width: 40 } },
  action: { field: PRESET_ACTION, style: { width: 42 } }
}
export const IS_PRESET = (field: string) => {
  let b = false
  for (const o in PRESET_FIELDS) {
    if (PRESET_FIELDS[o].field === field) {
      b = true
      break
    }
  }
  return b
}

export const IS_INDEX = (field: string) => PRESET_INDEX === field
export const IS_CHECKBOX = (field: string) => PRESET_CHECKBOX === field
export const IS_RADIO = (field: string) => PRESET_RADIO === field

export function useTdWidth(
  isAuto: ComputedRef<boolean>,
  inner: Ref | ComputedRef,
  bodyColumns: ComputedRef
) {
  // const { start } = useDelay()
  //设置a，只是为了重新计算tdWidths
  const a = ref(0)
  const tdWidths = computed(() => {
    let totalTdWidth = a.value - a.value
    let totalStretchWidth = 0
    const wrapperWidth = inner.value
      ? Math.floor(inner.value.clientWidth) + 1
      : window.innerWidth
    //使用组件时设置的宽度
    let widths = bodyColumns.value.map((col: any, index: number) => {
      let style =
        typeof col.style === 'function' ? col.style(null, null, {}) : col.style
      //w是通过代码设置的宽度
      //由于width的单位可能是px、em、rem、vh、vw单位，故需要转换成px
      //TODO: 待完善，此处只简单的转换一下
      let w = style?.width ?? 120
      if (hasUnit(w)) {
        if (getUnit(w) !== 'px') {
          w = parseFloat(w) * 12
        }
      }
      // const w = style?.width ?? 120
      totalTdWidth += w
      if (!IS_PRESET(col.field) && !col.lockWidth) {
        totalStretchWidth += w
      }
      return w
    })
    //计算后的真实宽度
    // console.log(totalTdWidth, widths)
    if (isAuto.value) {
      //预置的列，不参与计算
      if (wrapperWidth > totalTdWidth) {
        const restWidth = wrapperWidth - totalTdWidth
        widths = bodyColumns.value.map((col: any, i: number) => {
          if (IS_PRESET(col.field) || col.lockWidth) {
            return widths[i]
          } else {
            return (
              widths[i] +
              Math.floor(restWidth * (widths[i] / totalStretchWidth))
            )
          }
        })
      }
    }

    // resizeWidths.value = [...widths]
    // console.log(resizeWidths.value)

    return widths
  })
  useEvent(window, 'resize', () => {
    // start(() => {
    //   a.value += 1
    // })
    a.value += 1
  })

  return { tdWidths }
}

export function useColumns(columns: ComputedRef, opts: ComputedRef) {
  const col_index = computed(() => ({
    name: opts.value.indexContent,
    ...PRESET_FIELDS.index
  }))
  const col_checkbox = { ...PRESET_FIELDS.checkbox }
  const col_radio = { ...PRESET_FIELDS.radio }
  const col_action = { ...PRESET_FIELDS.action }
  let cols = computed(() => {
    let _columns = columns.value
    let validCols: any[] = []
    //对columns进行处理
    if (typeof _columns === 'function') {
      _columns = _columns()
    }
    _columns = _columns.forEach((c: any) => {
      if (isObject(c)) {
        validCols.push(c)
      } else if (isFunction(c)) {
        let f = c()
        if (isObject(f)) {
          validCols.push(f)
        }
      }
    })
    let arr: any[] = []
    if (opts.value.hasIndex || opts.value.hasAction) {
      arr.push(col_index.value)
    }
    if (opts.value.hasCheckbox) {
      arr.push(col_checkbox)
    } else if (opts.value.hasRadio) {
      arr.push(col_radio)
    }
    // if (opts.value.hasAction) {
    //   arr.push(col_action)
    // }
    return [...arr, ...validCols]
  })

  return cols
}

export function useFixed(
  tableRoot: Ref,
  innerTable: Ref | ComputedRef,
  leftFixed: ComputedRef,
  rightFixed: ComputedRef,
  hasSum: Ref
) {
  const { scrollTop, scrollBottom, scrollLeft, scrollRight, getScroll } =
    useScroll(
      innerTable,
      () => {
        nextTick(setFixed)
      },
      true
    )

  const showTopShadow = ref(false)
  const showBottomShadow = ref(false)
  const showLeftShadow = ref(false)
  const showRightShadow = ref(false)
  const leftOffset = ref<number[]>([])
  const rightOffset = ref<number[]>([])
  const leftShadowPosition = ref(-1000)
  const rightShadowPosition = ref(-1000)
  const leftNumber = computed(() => {
    if (leftFixed.value) {
      return Number(leftFixed.value)
    }
    return 0
  })
  const rightNumber = computed(() => {
    if (rightFixed.value) {
      return Number(rightFixed.value)
    }
    return 0
  })
  function getTdsAndThs() {
    const scrollTarget = getElement(innerTable.value) as any
    const trs = [
      ...scrollTarget.querySelectorAll('.w-sheet-tbody>.w-sheet>tbody>tr')
    ]
    const ths = [
      ...scrollTarget.querySelectorAll(
        '.w-sheet-thead>.w-sheet>thead>tr>th.w-cell--sticky'
      )
    ]
    const footThs = hasSum.value
      ? [
          ...scrollTarget.querySelectorAll(
            '.w-sheet-tfoot>.w-sheet>tfoot>tr>th.w-cell--sticky'
          )
        ].slice(0, leftNumber.value)
      : []

    const firstRowtds = trs.length ? [...trs[0].querySelectorAll('td')] : []
    const firstRowLeftTds = firstRowtds.slice(0, leftNumber.value)
    const firstRowRightTds = firstRowtds.slice(-1 * rightNumber.value)
    let rightThs = []
    let rightTfootThs = []
    if (rightNumber.value > 0) {
      rightThs = [
        ...scrollTarget.querySelectorAll(
          '.w-sheet-thead>.w-sheet>thead>tr>th.w-cell--sticky'
        )
      ].slice(rightNumber.value * -1)
      rightTfootThs = [
        ...scrollTarget.querySelectorAll('.w-sheet-tfoot>.w-sheet>tfoot>tr>th')
      ].slice(rightNumber.value * -1)
    }
    return {
      trs,
      firstRowLeftTds,
      firstRowRightTds,
      ths,
      footThs,
      rightThs,
      rightTfootThs
    }
  }
  function reset() {
    leftOffset.value = []
    rightOffset.value = []
    const { trs, firstRowLeftTds, firstRowRightTds, ths, footThs } =
      getTdsAndThs()
    trs.forEach((tr: HTMLTableRowElement, i: number) => {
      if (i === 0) {
        const _tds = tr.querySelectorAll('td')
        const tds = Array.from(_tds)
        const leftTds = tds.slice(0, leftNumber.value)
        const rightTds = tds.slice(-1 * rightNumber.value)
        leftTds.forEach((td: any) => {
          td.classList.remove('w-cell--sticky')
          td.style.removeProperty('left')
        })
        rightTds.forEach((td: any) => {
          td.classList.remove('w-cell--sticky')
          td.style.removeProperty('right')
        })
      }
    })
    // firstRowRightTds.forEach((td: HTMLElement, i: number) => {
    //   td.classList.remove("w-cell--sticky")
    //   td.style.removeProperty("right")
    // })
    // firstRowLeftTds.forEach((td: HTMLElement, i: number) => {
    //   td.classList.remove("w-cell--sticky")
    //   td.style.removeProperty("left")
    // })
    getScroll()
    nextTick(() => {
      setFixed()
    })
  }
  function setFixed(e?: any) {
    const scrollTarget = getElement(
      e ? (e.target as HTMLElement) : innerTable.value
    )
    if (leftNumber.value !== 0 || rightNumber.value !== 0) {
      const {
        trs,
        firstRowLeftTds,
        firstRowRightTds,
        ths,
        footThs,
        rightThs,
        rightTfootThs
      } = getTdsAndThs()
      if (leftNumber.value !== 0) {
        if (scrollLeft.value > 0) {
          if (firstRowLeftTds.length) {
            //计算并设置左侧阴影的位置
            if (leftOffset.value.length === 0) {
              let leftPosition = 0
              leftOffset.value = firstRowLeftTds.map(
                (td: HTMLElement, i: number, arr) => {
                  const l = td.offsetLeft + 1
                  if (i === arr.length - 1) {
                    leftPosition = l + parseInt(getStyle(td, 'width'))
                  }
                  return l
                }
              )
              leftShadowPosition.value = leftPosition - 1
            }
            //设置左侧每一行中需要固定的那些列
            trs.forEach((tr) => {
              if (leftOffset.value.length) {
                const tds = [...tr.querySelectorAll('td')].slice(
                  0,
                  leftOffset.value.length
                )
                tds.forEach((td: HTMLElement, i: number) => {
                  td.style.left = leftOffset.value[i] + 'px'
                  td.classList.add('w-cell--sticky')
                })
              }
            })
            ths.forEach((th: HTMLElement, i: number) => {
              th.style.left = leftOffset.value[i] + 'px'
              if (hasSum.value && footThs.length) {
                if (footThs[i]) {
                  footThs[i].style.left = th.style.left
                }
              }
            })
          }
          showLeftShadow.value = true
        } else {
          showLeftShadow.value = false
        }
      }

      if (rightNumber.value !== 0) {
        if (scrollRight.value > 0) {
          if (rightOffset.value.length === 0) {
            let rightPosition = 0
            let t = 0
            rightOffset.value = firstRowRightTds
              .reverse()
              .map((td: HTMLElement, i: number, arr) => {
                if (i === 0) {
                  t += getBoundingClientRect(td).width
                  return 1
                } else {
                  // if (i === arr.length - 1) {
                  //   rightPosition = td.offsetLeft - scrollRight.value
                  // }
                  let right = t
                  t += getBoundingClientRect(td).width
                  return right + 1
                }
              })
              .reverse()
            // rightShadowPosition.value = rightPosition + 1
          }
          trs.forEach((tr, idx) => {
            if (rightOffset.value.length) {
              const tds = [...tr.querySelectorAll('td')].slice(
                -1 * rightOffset.value.length
              )
              tds.forEach((td: HTMLElement, i: number) => {
                td.style.right = rightOffset.value[i] + 'px'
                td.classList.add('w-cell--sticky')
              })
            }
          })

          rightThs.forEach((th: HTMLElement, i: number) => {
            th.style.right = rightOffset.value[i] + 'px'
            th.classList.add('w-cell--sticky')
            if (i === 0) {
              rightShadowPosition.value = th.offsetLeft + 1 - scrollLeft.value
            }
          })
          rightTfootThs.forEach((th: HTMLElement, i: number) => {
            th.style.right = rightOffset.value[i] + 'px'
            th.classList.add('w-cell--sticky')
          })
          showRightShadow.value = true
        } else {
          showRightShadow.value = false
        }
      }
    }

    showTopShadow.value = scrollTop.value > 0
    showBottomShadow.value = scrollBottom.value > 0
  }
  // useEvent(innerTable, 'scroll', setFixed)
  useEvent(window, 'resize', setFixed)
  // onMounted(() => nextTick(setFixed))
  return {
    showLeftShadow,
    showRightShadow,
    showBottomShadow,
    showTopShadow,
    leftShadowPosition,
    rightShadowPosition,
    reset
  }
}
