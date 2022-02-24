import type { App } from 'vue'
import { defineAsyncComponent } from 'vue'
export default {
  install(app: App) {
    app
      .component(
        'p-list',
        defineAsyncComponent(() => import('./PList'))
      )
      .component(
        'p-list-item',
        defineAsyncComponent(() => import('./PListItem'))
      )
      .component('p-list-options', defineAsyncComponent(() => import('./pListOptions')))
  }
}
