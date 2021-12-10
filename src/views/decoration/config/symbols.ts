import type { Ref, InjectionKey } from 'vue'
import type {
  ComponentDescription,
  SetCurrentComponent,
  DeleteComponent
} from './types'

/** 组件描述 */
export const ComponentDescriptionKey: InjectionKey<
  Ref<ComponentDescription | undefined | null>
> = Symbol('ComponentDescription')

/** 设置当前组件 */
export const SetCurrentComponentKey: InjectionKey<SetCurrentComponent> = Symbol(
  'SetCurrentComponent'
)

/** 删除一个组件 */
export const DeleteComponentKey: InjectionKey<DeleteComponent> =
  Symbol('DeleteComponent')

/** 更新组件内属性值 */
export const UpdateComponentKey: InjectionKey<
  ({ key, val, uid }: { key: string; val: any; uid?: string }) => void
> = Symbol('UpdateComponent')
