import { defineComponent, computed, inject, provide } from 'vue'
import Wrapper from '../base/ItemWrapper.vue'
import props from './props'
export default defineComponent({
    name: "p-list",
    components: { Wrapper },
    props: {
        ...Wrapper.props,
        ...props
    },
    setup(props, ctx) {
        provide('itemOptions', props.itemOptions)
        provide('type', props.type)
        const containerOptions = computed(() => {
            return {
                uid: props.uid,
                class: [' w-cursor-pointer'],
                style: {
                    background: props.background
                }
            }
        })
        const data = computed(() => {
            if (props.list) {
                return []
            } else {
                return []
            }
        })
        const listOptions = computed(() => {
            if (props.type == 'row') {
                return {
                    class: ['list', 'list_row']
                }
            } else {
                return {
                    class: ['list', 'list_column']
                }
            }
        })
        return (
            <Wrapper {...containerOptions.value}>
                <div {...listOptions.value} ></div>
            </Wrapper>
        )
    }
})