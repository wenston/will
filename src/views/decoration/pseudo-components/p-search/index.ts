import type { App } from 'vue'
import { defineAsyncComponent } from 'vue'
export default {
  install(app: App) {
    app
      .component(
        'p-search',
        defineAsyncComponent(() => import('./Search'))
      )
      .component(
        'p-search-options',
        defineAsyncComponent(() => import('./Options'))
      )
  }
}
