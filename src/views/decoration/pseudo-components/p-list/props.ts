import type { PropType } from 'vue'
import number from 'will-ui/components/number'

export default {
    type: {
        type: String, // 列表格式 单列和双列
        default: ''
    },
    itemOptions: { // 列表内显示的内容属性 默认全部显示
        type: Object,
        default: () => ({
            img: true, //是否显示图片
            name: true, // 是否名称或标题
            CPrice: true, // 是否显示现价
            OPrice: true,// 是否显示原价
            introduction: true, // 是否显示简介
            salesVolume: true // 是否显示销量
        })
    },
    itemType: { // 列表内显示的样式 1：样式1，2：样式2，3：样式3
        type: String,
        default: '1'
    },
    style: {
        style: { type: Object as PropType<Record<string, any> | undefined | null> }
    },
    list: {
        type: Array,
        default: () => [] // 数据来源
    }

}