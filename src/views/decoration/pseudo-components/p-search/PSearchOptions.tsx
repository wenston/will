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
import Choose from 'will-ui/components/choose/index'
import Write from 'will-ui/components/write/index'
export default defineComponent({
  components: { Choose, Write },
  name: 'p-search-options',
  props,
  setup(props, ctx) {
    const icons = ref<string[]>([])
    const updateOptions = inject(UpdateComponentKey, () => {
      throw new Error('updateComponentOptions 更新组件数据失败')
    })
    const containerOptions = computed(() => {
      return {
        class: []
      }
    })
    const inputOptions = computed(() => {
      return {
        modelValue: props.placeholder,
        block: true,
        'onUpdate:modelValue': (v: string) => {
          updateOptions({ key: 'placeholder', val: v })
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

          <Write {...inputOptions.value} />
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
                      }}
                    >
                      <Icon name={icon} />
                    </span>
                  ))}
                </div>
              )
            }}
          ></Layer>
          <p>背景色</p>
          <input {...bgOptions.value} />
          <p>搜索框的背景色</p>
          <input {...inputBgOptions.value} />
        </div>
      )
    }
  }
})
