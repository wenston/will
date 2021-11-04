import type { Slots, VNode, ComputedRef } from 'vue'
import { Comment, Fragment, Text } from 'vue'
import { computed, h, cloneVNode, createVNode } from 'vue'
import { isArray, isSet } from '../util'

const TEMPLATE: 'template' = 'template'

const isComment = (node: VNode): boolean => node.type === Comment
const isFragment = (node: VNode): boolean => node.type === Fragment
const isText = (node: VNode): boolean => node.type === Text

/**
 *
 * 插槽内容有以下种类，当调用时，也就是slots.slotname()时
 * 1. 无，连<template #slotname></template>都没有的情况下，结果是undefined
 * 2. 有<template #slotname></template>但没有内容，结果是[]
 * 3. <template #slotname>有内容</template>时，结果是[{...}...]
 *
 */

//返回插槽内容，如果是要返回插槽中第一个可用的节点。则需要判断是否为
//文本、片段，是的话，则进行包装之后再返回。
export default function useSlot(
  slotContent: ComputedRef,
  isFirst: boolean = false,
  elementTag: string = 'span'
): ComputedRef<VNode | undefined> {
  return computed(() => {
    let c = slotContent.value
    // console.log(c)
    if (hasSlot(c)) {
      if (isFirst) {
        //renderSlot得出的内容总是Fragment类型
        if (isFragment(c)) {
          c = c.children
          // console.log(c)
        }
        const first = getFirstValidChild(c)

        if (first !== undefined) {
          if (isText(first) || isFragment(first)) {
            const wrapper_c = createVNode(elementTag, {}, c)
            return wrapper_c
          }
          if (isFirst) {
            return isArray(c) ? c[0] : c
          }
          return c
        }
      } else {
        return c
      }
    }
  })
}

/**
 *
 * @param slotContent VNode[]
 * @returns boolean
 */

function hasSlot(slotContent: VNode | VNode[] | undefined): boolean {
  const c = slotContent
  if (c === undefined || (c && isArray(c) && c.length === 0)) {
    return false
  }
  return true
}

//注释不算有效节点
function getFirstValidChild(slotContent: VNode | VNode[]): VNode | undefined {
  if (isArray(slotContent)) {
    let vnode: VNode | undefined
    let i = 0
    const len = slotContent.length
    while (i < len) {
      const c = slotContent[i]
      if (!isComment(c)) {
        vnode = c
        break
      }
    }
    return vnode
  }
  return slotContent
}
