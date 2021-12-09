import { defineComponent, computed } from 'vue'
import css from './index.module.css'
export default defineComponent({
  name: 'p-search-options',
  props: {
    modelValue: {
      type: String,
      default: '关键字搜索'
    }
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const containerOptions = computed(() => {
      return {
        class: [css['p-search'], 'w-cursor-pointer']
      }
    })
    const inputOptions = computed(() => {
      return {
        value: props.modelValue,
        style: {
          width: '100%'
        },
        modelValue: props.modelValue,
        'update:modelValue': (v: string) => {
          ctx.emit('update:modelValue', v)
        }
      }
    })
    return () => {
      return (
        <div {...containerOptions.value}>
          <p>
            <h3>搜索组件</h3>
          </p>
          <p>搜索框内文本描述</p>
          <div style="width:100%;">
            <input {...inputOptions.value} />
          </div>
        </div>
      )
    }
  }
})
