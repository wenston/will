import type { App, VNode } from 'vue'
import { createApp, createVNode, h } from 'vue'
import Drawer from '../drawer'
import Close from '../close'
import Btn from '../btn'

let ConfirmInstance: App
let ConfirmWrapper: HTMLElement

interface ConfirmOptions {
  content: any
  ok: () => void
  title?: string | VNode
  okText?: string
  cancelText?: string
  cancel?: () => void
}

function open(options: ConfirmOptions = { content: '', ok: () => {} }) {
  const wrapper = document.createElement('template')
  const vm = createVNode(
    Drawer,
    {
      placement: 'center',
      isConfirm: true,
      canCloseByClickMask: true,
      headerClass: 'w-confirm-header',
      bodyClass: 'w-confirm-body',
      footerClass: 'w-confirm-footer',
      afterClose: destroy
    },
    {
      default: ({ close }: any) => {
        let cont: any = null
        if (typeof options.content === 'function') {
          cont = options.content(close)
        } else {
          cont = options.content
        }
        return cont
      },
      header: ({ close }: any) => {
        return [
          h('span', {}, options.title ?? '提示'),
          h(Close, {
            onClick: () => {
              close()
              options.cancel?.()
            }
          })
        ]
      },
      footer: ({ close }: any) => {
        return [
          h(
            Btn,
            {
              onClick: () => {
                close()
                options.cancel?.()
              }
            },
            {
              default: () => options.cancelText ?? '取消'
            }
          ),
          h(
            Btn,
            {
              type: 'primary',
              onClick: () => {
                close()
                options.ok?.()
              }
            },
            { default: () => options.okText ?? '确定' }
          )
        ]
      }
    }
  )
  const ins = createApp(vm)
  ins.mount(wrapper)
  document.body.appendChild(wrapper)
  ConfirmInstance = ins
  ConfirmWrapper = wrapper
}

function destroy() {
  document.body.removeChild(ConfirmWrapper)
  ConfirmInstance.unmount()
}

function install(app: App) {
  app.config.globalProperties.$confirm = open
}

export default { install, open }
import './src/style/index.css'
