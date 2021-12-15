import type { App } from 'vue'
import { createVNode, createApp } from 'vue'
import type { NoticeOptions } from './Notice'
import MainNotice from './Notice'
import { createNoticeWrapper, clearNoticeWrapper } from './src/_util/index'

const NoticeAppMap = new Map<
  number | undefined, //uid
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
      'onAfter-leave': (el: HTMLElement, uid: number) => {
        _destroy(noticeWrapper, itemWrapper, notice)
        if (NoticeAppMap.size === 0) {
          clearNoticeWrapper()
        }
      },
      onClose: (close: any) => {
        _close = close
      },
      'onGet-uid': (uid: number) => {
        NoticeAppMap.set(uid, { noticeWrapper, close: _close, afterClose })
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
  // NoticeAppMap.set(_uid, { noticeWrapper, close: _close, afterClose })
  return notice
}

function close(app: App) {
  const uid = app._instance?.uid
  if (uid !== undefined) {
    if (NoticeAppMap.has(uid)) {
      const n = NoticeAppMap.get(uid)
      if (n) {
        n.close()
        if (n.afterClose) {
          n.afterClose()
        }
        NoticeAppMap.delete(uid)
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
}

function _renderContent(close: any, content: (d: () => void) => void) {
  return content(close)
}

function install(app: App) {
  app.config.globalProperties.$notice = open
}

export default { install, open, close }
import './src/style/index.css'
