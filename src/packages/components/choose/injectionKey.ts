import type { InjectionKey, ComputedRef } from 'vue'
type SetValue = (v: number | string | undefined) => void
export const CurrentLabelKey: InjectionKey<number | string | undefined> =
  Symbol()
export const CurrentValueKey: InjectionKey<
  ComputedRef<number | string | undefined>
> = Symbol()

export const SetCurrentValueKey: InjectionKey<SetValue> = Symbol()

export const SetCurrentLabelKey: InjectionKey<SetValue> = Symbol()

export const ToCloseKey: InjectionKey<() => void> = Symbol()
