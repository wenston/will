import type { InjectionKey, ToRefs } from 'vue'

export const LayerSizeKey: InjectionKey<{ width: number; height: number }> =
  Symbol()
