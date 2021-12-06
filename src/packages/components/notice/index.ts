import { App, createVNode, createApp } from 'vue'
import type { NoticeOptions } from './Notice'
import MainNotice from './Notice'
import { createNoticeWrapper, clearNoticeWrapper } from './src/_util/index'

const NoticeAppMap = new Map<
  App,
  { noticeWrapper: HTMLElement; close: () => void; afterClose?: () => void }
>()

const defaultOptions: NoticeOptions = {
  content: '默认的通知',
  placement: 'top-end',
  duration: 4500,
  manual: false
}

function open(options: NoticeOptions): App {
  const placement = options.placement || defaultOptions.placement
  const manual = options.manual ?? defaultOptions.manual
  const duration = options.duration ?? defaultOptions.duration
  const content = options.content ?? defaultOptions.content
  const afterClose = options.afterClose
  const itemWrapper = document.createElement('div')
  const noticeWrapper = createNoticeWrapper(placement!)
  let _close = () => {}
  const vm = createVNode(
    MainNotice,
    {
      placement,
      manual,
      duration,
      'onAfter-enter': (el: HTMLElement) => {
        // console.log(el)
      },
      'onAfter-leave': (el: HTMLElement) => {
        _destroy(noticeWrapper, itemWrapper, notice)
      },
      onClose: (close: any) => {
        _close = close
      }
    },
    {
      default: () => {
        if (typeof content === 'function') {
          return _renderContent(_close, content)
        } else {
          return content
        }
      }
    }
  )
  // console.log(vm)
  const notice = createApp(vm)
  notice.mount(itemWrapper)
  noticeWrapper.appendChild(itemWrapper)
  NoticeAppMap.set(notice, { noticeWrapper, close: _close, afterClose })
  return notice
}

function close(app: App) {
  if (NoticeAppMap.has(app)) {
    const n = NoticeAppMap.get(app)
    if (n) {
      n.close()
      if (n.afterClose) {
        n.afterClose()
      }
      // const noticeWrapper = n.noticeWrapper
      NoticeAppMap.delete(app)
      if (NoticeAppMap.size === 0) {
        clearNoticeWrapper()
      }
    }
  }
}

function _destroy(
  noticeWrapper: HTMLElement,
  wrapper: HTMLElement,
  app_notice: App
) {
  app_notice.unmount()
  noticeWrapper.removeChild(wrapper)
  close(app_notice)
}

function _renderContent(close: any, content: (d: () => void) => void) {
  return content(close)
}

function install(app: App) {
  app.config.globalProperties.$notice = open
}

export default { install, open, close }
import './src/style/index.css'
