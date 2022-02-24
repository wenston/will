import Radio from 'will-ui/components/radio/index'
import props from './props'

import { UpdateComponentKey } from 'decoration-symbols'

export default defineComponent({
    props,
    setup(props) {
        const updateComponentOptions = inject(UpdateComponentKey, () => { })
        const listOptions = computed(() => {

        })
        const select = ref(props.type)
        const type = ['样式1', '样式2'].map((item, index) => {
            const options = {
                value: index == 0 ? 'row' : 'column',
                text: item,
                modelValue: props.type,
                'onUpdate:modelValue': (v: string) => {
                    // if (props.type) {
                    select.value = v
                    console.log(props.type);

                    updateComponentOptions({ key: 'type', val: v })
                    // }
                }
            }
            return <Radio {...options}></Radio>
        })
        return () => (
            <>
                <p>列表展示格式</p>
                {type}
            </>
        )
    }
})