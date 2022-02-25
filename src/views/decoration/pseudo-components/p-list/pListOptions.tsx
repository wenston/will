import Radio from 'will-ui/components/radio/index'
import props from './props'
import Checkbox from 'will-ui/components/checkbox/index'
import { UpdateComponentKey } from 'decoration-symbols'

export default defineComponent({
  props,
  setup(props) {
    const updateComponentOptions = inject(UpdateComponentKey, () => { })
    const ItemOptionsContent: any = {
      img: '图片',
      name: '标题',
      CPrice: '现价',
      OPrice: '原价',
      introduction: '简介',
      salesVolume: '销量'
    }

    const listItemOptions = computed(() => {
      let op: any = []
      try {
        for (const keys in props.itemOptions) {
          const options = {
            text: ItemOptionsContent[keys],
            modelValue: props.itemOptions[keys],
            'onChange': (v: number) => {
              const vs: any = {}
              vs[keys] = v
              updateComponentOptions({
                key: 'itemOptions',
                val: {
                  type: 'Object',
                  ...vs
                }
              })
            }
          }
          const el: any = <Checkbox {...options}></Checkbox>
          op.push(el)
        }
      } catch (error) { }
      return op
    })

    const type = computed(() => {
      return ['样式1', '样式2'].map((item, index) => {
        const options = {
          value: index == 0 ? 'row' : 'column',
          text: item,
          modelValue: props.type,
          'onUpdate:modelValue': (v: string) => {
            updateComponentOptions({ key: 'type', val: v })
          }
        }
        return <Radio {...options}></Radio>
      })
    })

    return () => (
      <>
        <p>列表展示格式</p>
        {type.value}
        <p>展示内容选择</p>
        {listItemOptions.value}
      </>
    )
  }
})
