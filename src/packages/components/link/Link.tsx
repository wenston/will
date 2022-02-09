import { computed, defineComponent, h, renderSlot } from 'vue'
// import type { CSSProperties } from 'vue'
import Icon from '../icon/index'
export default defineComponent({
    name: 'KLink',
    props: {
        type: {
            type: String,
            default: 'primary' //
        },
        disable: {
            type: Boolean,
            default: false
        },
        href: {
            type: String,
            default: ""
        },
        icon: {
            type: String,
            default: ""
        }

    },
    setup(props, ctx) {

        const classS = computed(() => {
            let s = []

            if (props.disable) {
                s.push('is-pointer-events')
            } else {
                s.push(`k-link-${props.type}`)
            };

            return {
                href: props.href ? props.href : "javascript:;",
                class: s,
                disabled: props.disable
            }
        })
        return () => (<a {...classS.value}>{ctx.slots.default?.() ?? '点击'}</a>)
    }

})