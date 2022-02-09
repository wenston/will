import { defineComponent, computed, ref, onMounted, watch, reactive, h, renderSlot } from 'vue'
export default defineComponent({
    name: "DragoverItem",
    props: {
        dataId: {
            type: [String, Number],
            default: ''
        },
        tag: {
            type: String,
            default: "div"
        },
        cursor: {
            type: String,
            default: 'move',
        },
        oldClass: {
            type: String,
            default: ""
        }
    },
    setup(props, ctx) {
        const cursors = computed(() => {
            return "cursor:" + props.cursor
        })
        return () => h(
            props.tag,
            {
                "data-id": props.dataId,
                class: ['DragoverItem', props.oldClass],
                style: cursors.value
            },
            [renderSlot(ctx.slots, 'default')]
        )
    }

})