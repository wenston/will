import {
  defineComponent,
  ref,
  computed,
  inject,
  onMounted,
  nextTick
} from 'vue'
import { UpdateComponentKey } from 'decoration-symbols'
import props from './props'
import css from './index.module.css'
import Icon from 'will-ui/components/icon/index'
import Layer from 'will-ui/components/layer/index'
export default defineComponent({
  name: 'p-search-options',
  props,
  setup(props, ctx) {
    const icons = ref<string[]>([])
    const updateOptions = inject(UpdateComponentKey, () => {
      throw new Error('updateComponentOptions 更新组件数据失败')
    })
    const containerOptions = computed(() => {
      return {
        class: [css['p-search']]
      }
    })
    const inputOptions = computed(() => {
      return {
        value: props.placeholder,
        style: {
          width: '100%'
        },
        onInput: (e: Event) => {
          const val = (e.target as HTMLInputElement).value
          updateOptions({ key: 'placeholder', val })
        }
      }
    })
    const bgOptions = computed(() => {
      return {
        type: 'color',
        value: props.background,
        onInput: (e: Event) => {
          const val = (e.target as HTMLInputElement).value
          updateOptions({ key: 'background', val })
        }
      }
    })
    const inputBgOptions = computed(() => {
      return {
        type: 'color',
        value: props.inputBackground,
        onInput: (e: Event) => {
          const val = (e.target as HTMLInputElement).value
          updateOptions({ key: 'inputBackground', val })
        }
      }
    })
    onMounted(async () => {
      await nextTick()
      icons.value = ['w-icon-folder-open', 'w-icon-radio', 'w-icon-ball']
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
          <p>图标选择</p>
          <Icon name={props.icon} />
          <Layer
            placement="bottom"
            v-slots={{
              trigger: () => (
                <div style="width:fit-content" class="w-cursor-pointer">
                  请选择图标 <Icon name="w-icon-sort-down" />
                </div>
              ),
              default: ({ hide }: { hide: () => void }) => (
                <div style="width: 80px;line-height: 30px;padding: 15px;">
                  {icons.value.map((icon) => (
                    <span
                      class="w-cursor-pointer"
                      onClick={(e) => {
                        updateOptions({ key: 'icon', val: icon })
                        hide()
                      }}>
                      <Icon name={icon} />
                    </span>
                  ))}
                </div>
              )
            }}></Layer>
          <p>背景色</p>
          <input {...bgOptions.value} />
          <p>搜索框的背景色</p>
          <input {...inputBgOptions.value} />
        </div>
      )
    }
  }
})
