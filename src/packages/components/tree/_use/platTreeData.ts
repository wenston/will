import type { Ref, ComputedRef } from 'vue'
import { ref, unref, watch, watchEffect } from 'vue'
import { isObject } from '../../../util'
import useTreeState from './treeState'
import { plattenTreeData } from '../../../util/tools'
type StateType = {
  isSpread?: boolean
  isChecked?: boolean
}
//对源数据进行扁平化处理，处理的过程中，判断每条数据是否已经是展开状态，是展开
//状态的情况下，才会收集其子级。折叠状态时，其子级会暂时丢弃
export default function platTreeData(
  treeData: Ref<any[]> | ComputedRef<any[]>,
  keyField: string,
  childField: string,
  levelField: string,
  stateMap: Ref<Map<unknown, StateType>>,
  getState: Function,
  setState: Function,
  rule: any,
  onlyOne: Boolean,
  selectedKeys: Ref<any[]> | ComputedRef<any[]>
) {
  const totalPlattenData = ref<any[]>([])
  const filterPlattenData = ref<any[]>([])
  //用来保存节点和其下级
  const cacheDataMap = ref<Map<any, any>>(new Map())
  function toggle(item: any, itemIndex: number) {
    const state = getState(item[keyField])
    // console.log(state)
    if (state) {
      const { isSpread, isChecked } = state
      if (isSpread) {
        fold(item, itemIndex)
      } else {
        spread(item, itemIndex)
      }
    } else {
      spread(item, itemIndex)
    }
  }
  function spread(item: any, itemIndex: number) {
    if (item[childField] && item[childField].length) {
      //如果同级只能展开一项，则检查其他同级，如果是已经展开状态就删除其子级
      if (onlyOne) {
        //首先从当前行开始向下找同级，并找到同级的子孙级执行删除
        const curLevel = item[levelField]
        let i = itemIndex + 1
        while (i < filterPlattenData.value.length) {
          const el = filterPlattenData.value[i]
          const elLevel = el[levelField]
          if (curLevel < elLevel) {
            filterPlattenData.value.splice(i, 1)
            --i
          } else if (curLevel > elLevel) {
            break
          }
          const state = getState(el[keyField])
          if (state && state.isSpread) {
            setState(el[keyField], { isSpread: false })
          }
          i++
        }
        //展开当前行
        filterPlattenData.value.splice(itemIndex + 1, 0, ...item[childField])
        setState(item[keyField], { isSpread: true })
        //向上找同级的子孙级并删除
        i = itemIndex - 1
        while (i > -1) {
          const el = filterPlattenData.value[i]

          const elLevel = el[levelField]
          if (curLevel < elLevel) {
            filterPlattenData.value.splice(i, 1)
          } else if (curLevel > elLevel) {
            break
          }
          const state = getState(el[keyField])
          if (state && state.isSpread) {
            setState(el[keyField], { isSpread: false })
          }
          i--
        }
      } else {
        filterPlattenData.value.splice(itemIndex + 1, 0, ...item[childField])
      }

      //找到当前节点的父级，并获取item的所有同级节点(不包括自己)
      //然后，将同级节点下的所有子孙节点都删除
      // let parent = getParent(item, itemIndex)
      // if (parent) {
      // }
    }
  }
  function fold(item: any, itemIndex: number) {
    const len = item[childField]?.length ?? 0
    if (len) {
      const curLevel = item[levelField]
      let i = itemIndex + 1
      while (i < filterPlattenData.value.length) {
        const el = filterPlattenData.value[i]
        const elLevel = el[levelField]
        if (elLevel > curLevel) {
          filterPlattenData.value.splice(i, 1)
          const state = getState(el[keyField])
          if (state?.isSpread) {
            setState(el[keyField], { isSpread: false })
          }
          i--
        } else {
          break
        }
        i++
      }
      setState(item[keyField], { isSpread: false })
    }
  }

  function getParent(item: any, index: number) {
    let i = index - 1
    let parentItem = null
    if (item[levelField] === 1) {
      parentItem = {
        [childField]: filterPlattenData.value.filter(
          (el) => el[levelField] === 1
        )
      }
    } else {
      while (i > -1) {
        const curItem = filterPlattenData.value[i]
        if (curItem[levelField] - item[levelField] === -1) {
          parentItem = curItem
          break
        }
        i--
      }
    }

    return parentItem
  }

  function isExist(k: any) {
    return selectedKeys.value.some((s) => s === k)
  }
  //兄弟节点是否都选中了？
  function siblingsWereAllSelected(item: Record<any, any>, itemIndex: number) {
    let isAllSelected: boolean = true
    let isAllNotSelected: boolean = true
    let i = itemIndex + 1
    while (i < filterPlattenData.value.length) {
      const el = filterPlattenData.value[i]
      if (el[levelField] === item[levelField]) {
        const isChecked = isExist(el[keyField])
        // console.log(el, isChecked)
        if (!isChecked) {
          isAllSelected = false
        } else {
          isAllNotSelected = false
        }
        if (!isAllNotSelected && !isAllSelected) {
          break
        }
      } else if (item[levelField] > el[levelField]) {
        break
      }
      i++
    }
    if (!isAllSelected && !isAllNotSelected) {
      return { isAllSelected, isAllNotSelected }
    } else {
      i = itemIndex - 1
      while (i > -1) {
        const el = filterPlattenData.value[i]
        if (el[levelField] !== item[levelField]) {
          break
        } else {
          const isChecked = isExist(el[keyField])
          if (!isChecked) {
            isAllSelected = false
          } else {
            isAllNotSelected = false
          }
          if (!isAllNotSelected && !isAllSelected) {
            break
          }
        }
        i--
      }
    }
    return { isAllSelected, isAllNotSelected }
  }

  //给定一个节点，检查其所有子级的选择状态，是否全部选中，是否全部没有选中
  function allChildrenSelectedState(item: Record<any, any>, itemIndex: number) {
    let isAllNotSelected = true
    let isAllSelected = true
    const childLevel = item[levelField] + 1
    let i = itemIndex + 1
    while (i < filterPlattenData.value.length) {
      const el = filterPlattenData.value[i]
      const elLevel = el[levelField]
      if (elLevel === childLevel) {
        const isChecked = isExist(el[keyField])
        if (!isChecked) {
          isAllSelected = false
        } else {
          isAllNotSelected = false
        }
        if (!isAllNotSelected && !isAllSelected) {
          break
        }
      } else if (elLevel < childLevel) {
        break
      }
      i++
    }
    // console.log(isAllNotSelected)
    return { isAllSelected, isAllNotSelected }
  }

  //当前行选中时，返回的是需要选的
  //当前行取消选中时，返回的是不需要选的
  function toSelectParent(
    b: boolean,
    item: Record<any, any>,
    itemIndex: number
  ) {
    let shouldSelectedKeys: any[] = []
    let shouldDeleteKeys: any[] = []
    if (b) {
      shouldSelectedKeys.push(item[keyField])
    } else {
      shouldDeleteKeys.push(item[keyField])
    }
    //选出当前item的所有父级
    let allParent: [Record<any, any>, number][] = []
    let i = itemIndex - 1
    let parentLevel = item[levelField] - 1
    while (i > -1) {
      const el = filterPlattenData.value[i]
      if (el[levelField] < item[levelField] && parentLevel === el[levelField]) {
        allParent.push([el, i])
        parentLevel -= 1
      }
      if (el[levelField] === 1) {
        break
      }

      i--
    }
    console.log(allParent)
    if (allParent.length > 0) {
      if (rule === 'some') {
        if (b) {
          allParent.forEach(([p]) => {
            if (!isExist(p[keyField])) {
              shouldSelectedKeys.push(p[keyField])
            }
          })
        } else {
          //先处理直接父级
          allParent.forEach(([p, i], index) => {
            if (index === 0) {
              const { isAllNotSelected } = siblingsWereAllSelected(
                item,
                itemIndex
              )
              if (isAllNotSelected) {
                shouldDeleteKeys.push(p[keyField])
              }
            } else {
              const { isAllNotSelected } = allChildrenSelectedState(p, i)
              console.log(p, isAllNotSelected)
              if (isAllNotSelected) {
                shouldDeleteKeys.push(p[keyField])
              }
            }
          })
        }
      } else if (rule === 'every') {
      }
    }

    // console.log(shouldDeleteKeys.join(','))

    return { shouldSelectedKeys, shouldDeleteKeys }
  }
  function toSelectChildren(
    b: boolean,
    item: Record<any, any>,
    itemIndex: number
  ) {
    let shouldSelectedKeys: any[] = []
    let shouldDeleteKeys: any[] = []
    if (b) {
      shouldSelectedKeys.push(item[keyField])
    } else {
      shouldDeleteKeys.push(item[keyField])
    }
    //选择当前item的所有子级
    //本级节点没有展开的情况下是没有下级数据的，故应使用全量数据
    const allChildren: [Record<any, any>, number][] = []
    const index = totalPlattenData.value.findIndex(
      (t) => t[keyField] === item[keyField]
    )
    let i = index + 1
    if (i > 0) {
      while (i < totalPlattenData.value.length) {
        const el = totalPlattenData.value[i]
        if (item[levelField] < el[levelField]) {
          allChildren.push([el, i])
        } else {
          break
        }
        i++
      }
    }

    if (allChildren.length) {
      if (rule === 'some') {
        if (b) {
          allChildren.forEach(([c, i]) => {
            if (!isExist(c[keyField])) {
              shouldSelectedKeys.push(c[keyField])
            }
          })
        } else {
          allChildren.forEach(([c, i]) => {
            if (isExist(c[keyField])) {
              shouldDeleteKeys.push(c[keyField])
            }
          })
        }
      }
    }
    return { shouldDeleteKeys, shouldSelectedKeys }
  }

  watch(
    treeData,
    (sourceData) => {
      // console.log(stateMap.value)
      const { filterPlattenData: f, totalPlattenData: t } = plattenTreeData(
        sourceData,
        childField,
        (parentItem: any, item: any) => {
          if (item[levelField] == 1) {
            return true
          } else {
            //判断父级节点是否展开，如果展开了，则返回true
            const state = getState(parentItem[keyField])
            if (state) {
              if (state.isSpread) {
                return true
              }
            }
            return false
          }
        }
      )
      filterPlattenData.value = f
      totalPlattenData.value = t
    },
    { immediate: true, deep: true }
  )
  return {
    filterPlattenData,
    spread,
    fold,
    toggle,
    toSelectParent,
    toSelectChildren
  }
}
