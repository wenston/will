import { defineComponent, computed, inject, provide } from 'vue'
import Wrapper from '../base/ItemWrapper.vue'
import props from './props'
import PListItem from './PListItem'
export default defineComponent({
    name: "p-list",
    components: { Wrapper, PListItem },
    props: {
        ...Wrapper.props,
        ...props
    },
    setup(props, ctx) {
        console.log('p-list');

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
            // if (props.list) {
            //     return []
            // } else {
            //     return []
            // }
            let a = [1, 2]
            let obj = {
                name: '',
                img: '',
                price: '',
                salesVolume: ''
            }
            return a.map(item => {
                return <PListItem item={obj}></PListItem>
            })
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
                <div {...listOptions.value} >
                    {data.value}
                </div>
            </Wrapper>
        )
    }
})