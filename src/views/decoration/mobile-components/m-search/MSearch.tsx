import { defineComponent, computed } from 'vue'
import './m-search.css'
export default defineComponent({
  props: {
    placeholder: {
      type: String,
      default: '关键字搜索'
    }
  },
  setup(props, ctx) {
    const containerOptions = computed(() => {
      return {
        class: 'p-search w-cursor-pointer'
      }
    })
    return () => {
      return (
        <div {...containerOptions.value}>
          <input placeholder={props.placeholder} />
        </div>
      )
    }
  }
})
