import type { PropType } from 'vue'

export default {
    type: {
        type: String, // 列表格式 单列和双列
        default: 'row'
    },
    itemOptions: {
        // 列表内显示的内容属性 默认全部显示
        type: Object,
        default: () => ({
            img: 1, //是否显示图片
            name: 1, // 是否名称或标题
            CPrice: 1, // 是否显示现价
            OPrice: 1, // 是否显示原价
            introduction: 1, // 是否显示简介
            salesVolume: 1 // 是否显示销量
        })
    },
    itemType: {
        // 列表内显示的样式 t1：样式1，t2：样式2，t3：样式3
        type: String,
        default: 't1'
    },
    style: { type: Object as PropType<Record<string, any> | undefined | null> },

    // style: {
    //     type: { type: Object as PropType<Record<string, any> | undefined | null> },
    //     default: ''
    // },
    list: {
        type: Array,
        default: () => [] // 数据来源
    }
}
