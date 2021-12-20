import { IconComponentProps } from '../icon/type'
export interface LoadingComponentProps extends IconComponentProps {
  show?: boolean
  text?: string
  hasTransition?: boolean
  transitionName?: string
}
