// import { defineComponent, computed, inject, VNode } from 'vue'
import './list.css'

export default defineComponent({
  name: 'p-list-item',
  props: {
    item: {
      type: Object,
      default: () => { }
    },
    tp: {
      type: String,
      default: 'row'
    },
    itemOptions: {
      type: Object,
      default: () => ({
        img: 1, //是否显示图片
        name: 1, // 是否名称或标题
        CPrice: 1, // 是否显示现价
        OPrice: 1, // 是否显示原价
        introduction: 1, // 是否显示简介
        salesVolume: 1 // 是否显示销量
      })
    }
  },
  setup(props, ctx) {
    // console.log(css);

    // const type: any = inject('type')

    // const props.itemOptions = computed(() => {
    //     return props.itemOptions
    // })
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
      console.log(props.itemOptions);

      if (props.item && props.itemOptions) {
        let item = props.item
        let name: any = ''
        if (props.itemOptions?.name) {
          name = <div class="list-item_name">{item.name}</div>
        }
        let img: any = ''
        if (props.itemOptions?.img) {
          img = <img class="list-item_img" src={item.img} />
        }
        let price: any = ''
        if (props.itemOptions?.price) {
          price = <span>{item.price}</span>
        }
        let salesVolume: any = ''
        if (props.itemOptions?.salesVolume) {
          salesVolume = <span>{item.salesVolume}</span>
        }
        // let OPrice:String =''
        // if(props.itemOptions?.yPrice){
        //     OPrice = ``
        // }

        return {
          img: img || '',
          name: name || "",
          price: price || "",
          salesVolume: salesVolume || ''
        }
      } else {
        return {}
      }
    })
    return () => (
      <div {...cls.value}>
        <div class="list-item_content">
          {content.value?.img}
          {content.value?.name}
          <div>
            {content.value?.price}
            {content.value?.salesVolume}
          </div>
        </div>
      </div>
    )
  }
})
