export type ComponentDescription = {
  uid: string //组件唯一标识
  componentName: string //组件名，用来动态渲染组件
  options: Record<any, any> //参数，...props
  [x: string]: any
}

export type SetCurrentComponent = (component_uid: string) => void
export type DeleteComponent = (computed_uid: string) => void
