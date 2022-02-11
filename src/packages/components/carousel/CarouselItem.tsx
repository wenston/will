import { computed, defineComponent, h, provide, renderSlot, ref, getCurrentInstance, inject, onMounted } from 'vue'
import './style/index.css'
export default defineComponent({
    name: 'CarouselItem',
    props: {
        tag: {
            type: String,
            default: "div"
        }
    },
    setup(props, ctx) {
        const getUid: any = inject('getUid')
        onMounted(() => {
            getUid(getCurrentInstance()?.uid)
        })
        return () => h(
            props.tag,
            {
                class: ['w-carouselItem']
            },
            [renderSlot(ctx.slots, 'default')]
        )
    }
})