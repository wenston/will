import { computed, defineComponent, h, inject, renderSlot } from 'vue'
import type { CSSProperties } from 'vue'
export default defineComponent({
    name: 'KCol',
    props: {
        tag: {
            type: String,
            default: 'div'
        },
        span: {
            type: Number,
            default: 24,
        },
        offset: {
            type: Number,
            default: 0,
        },
        pull: {
            type: Number,
            default: 0,
        },
        push: {
            type: Number,
            default: 0,
        },
    },
    setup(props, { slots }) {
        const { gutter } = inject('KCol', { gutter: { value: 0 } })
        const style = computed<CSSProperties>(() => {
            if (gutter.value) {
                let p = gutter.value / 2
                let sy = {

                    paddingLeft: p + 'px',
                    paddingRight: p + 'px'
                }
                return sy
            }
            return {}
        })
        const c = computed(() => {
            let css: String[] = []
            if (props.span) {
                css.push(`k-col-${props.span}`)
            }
            if (props.offset) {
                css.push(`k-col-offset-${props.offset}`)
            }
            if (props.push) {
                css.push(`k-col-push-${props.push}`)
            }
            if (props.pull) {
                css.push(`k-col-pull-${props.pull}`)
            }
            return css
        })

        console.log(c.value, 'cc');
        return () => h(
            props.tag,
            {
                class: ['k-col', c.value],
                style: style.value
            },
            [renderSlot(slots, 'default')]

        )
    }

})