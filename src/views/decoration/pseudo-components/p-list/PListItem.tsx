import { defineComponent, computed, inject, VNode } from 'vue'
import './list.css'

export default defineComponent({
    name: "p-list-item",
    props: {
        item: {
            type: Object,
            default: () => { }
        },
        tp: {
            type: String,
            default: "row"
        },
        itemOptions: {
            type: Object,
            default: () => { }
        }
    },
    setup(props, ctx) {
        // console.log(css);

        // const type: any = inject('type')

        const options: any = inject('itemOptions')
        const cls = computed(() => {

            if (props.tp == 'row') {
                return {
                    class: ['list-item', 'list-item_row']
                }
            } else {
                return {
                    class: ['list-item', 'list-item_column']
                }
            }
        })
        const content = computed(() => {
            if (props.item) {
                let item = props.item
                let name: any = ''
                if (options?.name) {
                    name = <div class='list-item_name'>{item.name}</div>
                }
                let img: any = ''
                if (options?.img) {
                    img = <img class='list-item_img' src={item.img} />
                }
                let price: any = ''
                if (options?.price) {
                    price = <span>{item.price}</span>
                }
                let salesVolume: any = ''
                if (options?.salesVolume) {
                    salesVolume = <span>{item.salesVolume}</span>
                }
                // let OPrice:String =''
                // if(options?.yPrice){
                //     OPrice = ``
                // }
                return {
                    img,
                    name,
                    price,
                    salesVolume
                }
            } else {
                return {}
            }
        })
        return () => (
            <div {...cls.value}>
                <div class='list-item_content'>
                    {content.value?.img}
                    {content.value?.name}
                    <div>{content.value?.price}
                        {content.value?.salesVolume}
                    </div>
                </div>
            </div>
        )
    }
})