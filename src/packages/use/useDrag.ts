import { type Ref, watchEffect, ref, computed, onMounted, nextTick } from 'vue'
import { getElement, getOffset, getStyle } from '../util'
import { getBoundingClientRect, setStyle } from '../util'
import useEvent from './useEvent'
import useMouse from './useMouse'

type MaybeElement = HTMLElement | Ref<HTMLElement>

interface DragOptions {
  handler: MaybeElement
  parent?: MaybeElement
  direction: {
    x: boolean
    y: boolean
  }
  pos?: {
    left?: number
    top?: number
  }
  handleDragging: () => void
}

export default function useDrag(options: DragOptions) {}
