import { defineComponent, provide, computed, TransitionGroup, onMounted, ref, toRef, watch, onUpdated } from 'vue'
// import useMouse from '../../use/useMouse'
export default defineComponent({
    name: "Dragover",
    props: {
        modelValue: {
            type: Array,
            default: () => []
        },
        type: {
            type: String,
            default: 'row'
        },
        canter: {
            type: String,
            default: null
        },
        flex: {
            type: Boolean,
            default: true
        },
        keys: {
            type: String || Number,
            default: ''
        },
        isFrom: {
            type: Boolean,
            default: false
        },
        to: {
            type: Boolean,
            default: false
        },
        from: {
            type: Boolean,
            default: false
        },


    },
    emit: ['update:modelValue', 'move', 'update', 'add'],

    setup(props, ctx) {
        const oldData: any = ref(null)
        const newData: any = ref(null)
        const oldItem: any = ref(null)
        const uid: any = ref([])
        const Uids: any = ref([])
        provide('update', update)
        provide('data', props.modelValue)
        provide('dragstart', dragstart)
        provide('dragenter', dragenter)
        provide('drop', drop)
        provide('getUids', getUids)
        provide('getUid', getUid)
        // const { client } = useMouse()

        // watch(() => client.x, (v) => {
        //     console.log(v);
        // })
        const root = ref(null)
        function getUid<T>(v: T): void {

            // if (uid.value.indexOf(newData.value)) {
            //     uid.value.splice(uid.value.indexOf(newData.value), 0, v)
            // } else {
            uid.value.push(v)
            // }


        }
        function getUids<T>(v: T): void {
            if (dropIndex.value) {
                Uids.value.splice(dropIndex.value, 0, v)
                dropIndex.value = null
            } else {
                Uids.value.push(v)
            }
            // if (Uids.value.length && Uids.value.indexOf(newData.value)) {
            //     Uids.value.splice(Uids.value.indexOf(newData.value), 1)
            // }




        }
        const classS = computed(() => {
            let s = []
            if (props.type != 'row') {
                s.push('k-direction-column')
            }
            if (props.canter) {
                s.push('k-align-items-center')
            }
            if (props.flex) {
                s.push('k-flex')
            }
            return {
                class: s
            }
        })
        onUpdated(() => {
            console.log('onUpdated');

        })
        function dragover(e: any) {

            e.preventDefault()
        }
        function update(v: any) {
            if (newData.value && oldData.value && newData.value != oldData.value) {
                let i = uid.value.indexOf(oldData.value)
                let j = uid.value.indexOf(newData.value)
                // let item = newD.splice(i, 1)[0]
                let it = uid.value.splice(i, 1)[0]
                uid.value.splice(j, 0, it)
                // newD.splice(j, 0, item)
                newData.value = null
                oldData.value = null
                ctx.emit('update', { to: i, from: j })
            }
            // else {
            //     ctx.emit('after-drop', uid.value.indexOf(oldData.value))
            //     newData.value = null
            //     oldData.value = null
            // }
        }

        function getItem(v: Number): void {
            if (props.modelValue) {
                props.modelValue.forEach((item, index) => {
                    if (index == v) {
                        oldItem.value = item
                    }
                })
            }
        }
        function dragstart(value: any) {

            oldData.value = value
            // getItem(uid.value.indexOf(value))
        }
        function dragenter(value: any) {

            newData.value = value
            console.log(!oldData.value);

            // if (props.from && !oldData.value) {
            //     uid.value = Array.from(new Set(uid.value))
            //     if (Uids.value.length) {
            //         uid.value = Uids.value
            //     }
            //     uid.value = Array.from(new Set(uid.value))
            //     uid.value.push(...Uids.value)
            //     // Uids.value = []
            //     // uid.value = []
            // }


        }
        const dropIndex = ref(null)
        function drop<T>(v: T): void {
            if (props.from) {
                if (Uids.value) {
                    uid.value = Uids.value
                }
                dropIndex.value = uid.value.indexOf(v)
                ctx.emit('add', uid.value.indexOf(v))
            }
        }
        function enter(): void {
            oldData.value = null
        }
        function leave(): void {
            if (props.to && oldData.value) {
                ctx.emit('move', uid.value.indexOf(oldData.value))

                // uid.value = []
            }
        }
        return () => (<div ref={root} onMouseover={enter}
            onMouseout={leave} {...classS.value} onDragover={dragover}>
            <TransitionGroup name="sort">
                {ctx.slots.default?.()}
            </TransitionGroup>
        </div>)
    }
})