import { inject, defineComponent, computed } from 'vue'
import props from './props'
import css from './index.module.css'
import { UpdateComponentKey } from 'decoration-symbols'
import Radio from 'will-ui/components/radio/index'

export default defineComponent({
  props,
  setup(props) {
    const updateComponentOptions = inject(UpdateComponentKey, () => {
      throw new Error('updateCompontOptions 没有定义，请检查')
    })
    const fontSizeOptions = computed(() => {
      return {
        value: parseInt(props.style && props.style['font-size']) || '',
        onInput: (e: Event) => {
          const val = (e.target as HTMLInputElement).value
          console.log(props.style)
          if (props.style) {
            props.style['font-size'] = val + 'px'
            updateComponentOptions({ key: 'style', val: props.style })
          } else {
            const style = {
              'font-size': val + 'px'
            }
            updateComponentOptions({ key: 'style', val: style })
          }
          //   if (props.style) {
          //     const s = { ...props.style }
          //     s['font-size'] = val + 'px'
          //     updateComponentOptions({ key: 'style', val: s })
          //   } else {
          //     const s = {
          //       'font-size': val + 'px'
          //     }
          //     updateComponentOptions({ key: 'style', val: s })
          //   }
        }
      }
    })
    return () => (
      <>
        <p>标题名称</p>
        <div>
          <input
            type="text"
            value={props.text}
            onInput={(e) => {
              const val = (e.target as HTMLInputElement).value
              updateComponentOptions({ key: 'text', val })
            }}
          />
        </div>
        <p>其他样式</p>
        <ul>
          <li>
            字体大小
            <input {...fontSizeOptions.value} />
          </li>
          <li>
            对齐方式{' '}
            {['left', 'center', 'right'].map((p) => {
              const r = {
                modelValue: props.style ? props.style['text-align'] : undefined,
                value: p,
                text: p,
                'onUpdate:modelValue': (v: string) => {
                  console.log(v)
                  if (props.style) {
                    props.style['text-align'] = v
                    updateComponentOptions({ key: 'style', val: props.style })
                  } else {
                    const style = {
                      'text-align': v
                    }
                    updateComponentOptions({ key: 'style', val: style })
                  }
                }
              }
              return <Radio {...r} />
            })}
          </li>
        </ul>
      </>
    )
  }
})
