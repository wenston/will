import type { PropType } from 'vue'
export default {
  text: { type: String, default: '标题' },
  style: { type: Object as PropType<Record<string, any> | undefined | null> }
}
