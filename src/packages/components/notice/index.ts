import type { App, VNode } from 'vue'
import { createApp, createVNode } from 'vue'
import Notice from './Notice'

function NoticeComponent() {
  const noticeInstance = createVNode('div', {}, [
    createVNode('i', null, '哈哈哈哈')
  ])
  return noticeInstance
}
function open(app: App, options) {
  const ins = NoticeComponent()
  const wrapper = document.createElement('div')
  document.body.append(wrapper)
  const noticeApp = createApp(ins)
  console.log(noticeApp)
  //   noticeApp.mount(wrapper)
}

Notice.install = open

export { default } from './Notice'

import './style/index.css'
