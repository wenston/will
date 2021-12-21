import type { InjectionKey, ComputedRef, Ref } from 'vue'
type SetValue = (v: number | string | undefined) => void
export const CurrentLabelKey: InjectionKey<Ref<number | string | undefined>> =
  Symbol()
export const CurrentValueKey: InjectionKey<
  ComputedRef<number | string | undefined>
> = Symbol()

export const SetCurrentValueKey: InjectionKey<SetValue> = Symbol()

export const SetCurrentLabelKey: InjectionKey<SetValue> = Symbol()

export const ToCloseKey: InjectionKey<() => void> = Symbol()
