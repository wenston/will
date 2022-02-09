import { defineComponent, computed, inject } from 'vue'
export default defineComponent({
    name: "p-list-item",
    props: {
        item: {
            type: Object,
            default: () => { }
        }
    },
    setup(props, ctx) {
        const type: any = inject('type')
        const options: any = inject('itemOptions')
        const cls = computed(() => {
            if (type == 'row') {
                return {
                    class: ['list-item', 'list-item-row']
                }
            } else {
                return {
                    class: ['list-item', 'list-item-column']
                }
            }
        })
        const content = computed(() => {
            if (props.item) {
                let item = props.item
                let name: String = ''
                if (options?.name) {
                    name = `<div>${item.name}</div>`
                }
                let img: String = ''
                if (options?.img) {
                    img = `<img src='${item.img}' />`
                }
                let price:String = ''
                if(options?.price){
                    price = `<span>${item.price}</span>`
                }
                let salesVolume:String = ''
                if(options?.salesVolume){
                    salesVolume = `<span>${item.salesVolume}</span>`
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
            }else{
                return {}
            }
        })
        return(
            <div {...cls.value}>
            {content.value?.img}
            {content.value?.name}
            <div>{content.value?.price}
            {content.value?.salesVolume}
            </div>
          
            </div>
        )
    }
})