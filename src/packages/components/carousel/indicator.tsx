import { computed, defineComponent, h, ref, inject, watch, getCurrentInstance } from 'vue'
export default defineComponent({
    name: 'IndicatorItem',
    props: ["item"],
    setup(props, ctx) {
        const index: any = inject('index')
        const getIndicator: any = inject('getIndicator')
        const getUidIndicator: any = inject('getUidIndicator')
        const uidS: any = inject('uid')
        const uid = getCurrentInstance()?.uid
        getUidIndicator(uid)
        function selIndex(e: any) {
            getIndicator(uid)
            e.stopPropagation()
        }

        const i = computed(() => {
            return index.value < 0 || index.value > uidS.value.length - 1 ? 0 : index.value
        })


        return () => <div onClick={(e) => { selIndex(e) }} class={props.item == i.value ? 'w-indicator-item-active w-indicator-item' : 'w-indicator-item'}> {ctx.slots.default?.()}</div>
    }
})