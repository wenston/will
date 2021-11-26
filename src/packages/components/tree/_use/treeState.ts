/**
 * 存储或者初始化树的状态：节点的展开、折叠/ 选中等
 */
import { ref, watchEffect } from 'vue'
import { isObject } from '../../../util'
type StateType = {
  isSpread?: boolean
  isChecked?: boolean
}
export default function treeState<K>(onlyOne: boolean = true) {
  const stateMap = ref<Map<K, StateType>>(new Map())

  function setState(k: K, state: StateType): K {
    const prevState = getState(k)
    if (prevState) {
      const nowState = { ...prevState, ...state }
      stateMap.value.set(k, nowState)
    } else {
      stateMap.value.set(k, state)
    }
    // if (onlyOne) {
    //   for (const [key, value] of stateMap.value) {
    //     if (key !== k) {
    //       value.isSpread = false
    //     }
    //   }
    // }
    return k
  }

  function getState(k: K): StateType | undefined {
    return stateMap.value.get(k)
  }

  function hasState(k: K): boolean {
    return stateMap.value.has(k)
  }

  function collectState(list: Array<any>, keyField: string) {
    list.forEach((item) => {
      setState(item[keyField], { isSpread: false, isChecked: false })
    })
    console.log('状态自动收集完毕', stateMap.value)
  }

  //自动收集状态
  watchEffect(() => {
    //   collectState(list,keyField)
  })

  return { stateMap, setState, getState }
}
