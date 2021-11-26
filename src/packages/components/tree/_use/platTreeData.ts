import type { Ref, ComputedRef } from 'vue'
import { ref, unref, watch, watchEffect } from 'vue'
import { isObject } from '../../../util'
import useTreeState from './treeState'
import { plattenTreeNode } from '../../../util/tools'
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
  current: any,
  onlyOne: Boolean
) {
  const platData = ref<any[]>([])
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
        while (i < platData.value.length) {
          const el = platData.value[i]
          const elLevel = el[levelField]
          if (curLevel < elLevel) {
            platData.value.splice(i, 1)
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
        platData.value.splice(itemIndex + 1, 0, ...item[childField])
        setState(item[keyField], { isSpread: true })
        //向上找同级的子孙级并删除
        i = itemIndex - 1
        while (i > -1) {
          const el = platData.value[i]

          const elLevel = el[levelField]
          if (curLevel < elLevel) {
            platData.value.splice(i, 1)
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
        platData.value.splice(itemIndex + 1, 0, ...item[childField])
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
      while (i < platData.value.length) {
        const el = platData.value[i]
        const elLevel = el[levelField]
        if (elLevel > curLevel) {
          platData.value.splice(i, 1)
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
        [childField]: platData.value.filter((el) => el[levelField] === 1)
      }
    } else {
      while (i > -1) {
        const curItem = platData.value[i]
        if (curItem[levelField] - item[levelField] === -1) {
          parentItem = curItem
          break
        }
        i--
      }
    }

    return parentItem
  }

  watch(
    treeData,
    (sourceData) => {
      platData.value = plattenTreeNode(sourceData, childField, (item: any) => {
        if (item[levelField] == 1) {
          return true
        } else {
          const state = getState(item[keyField])
          if (state) {
            if (state.isSpread) {
              return true
            }
          }
          return false
        }
      })
    },
    { immediate: true }
  )
  return {
    platData,
    spread,
    fold,
    toggle
  }
}
