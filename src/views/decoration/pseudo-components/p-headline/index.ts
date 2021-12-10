import type { App } from 'vue'
import { defineAsyncComponent } from 'vue'
export default {
  install(app: App) {
    app
      .component(
        'p-headline',
        defineAsyncComponent(() => import('./PHeadline'))
      )
      .component(
        'p-headline-options',
        defineAsyncComponent(() => import('./PHeadlineOptions'))
      )
  }
}
