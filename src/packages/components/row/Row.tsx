import { computed, defineComponent, h, provide } from 'vue'
export default defineComponent({
    name: 'KRow',
    props: {
        tag: {
            type: String,
            default: 'div',
        },
        gutter: {
            type: Number,
            default: 0,
        },
        justify: {
            type: String,
            default: 'start',
        },
        align: {
            type: String,
            default: 'start',
        },
    },
    setup(props, { slots }) {
        const gutter = computed(() => props.gutter)
        provide('KCol', { gutter })
        const style = computed(() => {
            let sy = {
                paddingRight: '',
                paddingLeft: ''
            }
            if (props.gutter) {
                sy.paddingLeft = sy.paddingRight = `${props.gutter / 2}px`
            }
            return sy
        })

        return () =>
            h(
                props.tag,
                {
                    class: [
                        'k-row',
                        props.justify !== 'start' ? `justify-${props.justify}` : '',
                        props.align !== 'start' ? `align-${props.align}` : '',
                    ],
                    style: style.value
                },
                slots.default?.()
            )
    }
})