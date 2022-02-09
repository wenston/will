import { defineComponent, inject, ref, h, computed, renderSlot, getCurrentInstance, onMounted, onUpdated } from 'vue';
export default defineComponent({
    name: "DragoverItem",
    props: {
        tag: {
            type: String,
            default: 'div'
        },
        value: {
            type: String || Number,
            default: ''
        }
    },
    setup(props, ctx) {
        const uid: any = ref('')
        const Dragenter: any = inject('dragenter')
        const Dragstart: any = inject('dragstart')
        const update: any = inject('update')
        const Drop: any = inject('drop')
        const getUid: any = inject("getUid")
        const getUids: any = inject('getUids')
        // const update = inject('update:moduleValue')
        // const change = inject('change')

        onUpdated(() => {
            uid.value = getCurrentInstance()?.uid
            getUids(uid.value)
        })
        onMounted(() => {
            uid.value = getCurrentInstance()?.uid
            getUid(uid.value)
        })
        function dragstart(value: any) {
            Dragstart(uid.value)
        }
        // 记录移动过程中信息
        function dragenter(e: any) {
            Dragenter(uid.value)
            e.preventDefault()

        }
        // 拖拽最终操作
        function dragend(value: any, e: any) {
            update(uid.value)

        }
        function drop(e: any) {
            console.log(e);

            Drop(uid.value)
        }
        function cnt() {
            // return (<div style={ }></div>)
        }
        return () => h(

            props.tag, {
            draggable: true,
            onDragstart: (e: MouseEvent) => { dragstart(e) },
            onDragenter: (e: MouseEvent) => { dragenter(e) },
            onDragend: dragend,
            onDrop: (e: MouseEvent) => { drop(e) },


        },

            [renderSlot(ctx.slots, 'default')]
        )
    }

})