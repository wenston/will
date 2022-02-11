
# Vue 3 + Typescript + Vite

This template should help get you started developing with Vue 3 and Typescript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's `.vue` type support plugin by running `Volar: Switch TS Plugin on/off` from VSCode command palette.

<!-- ## 设计宗旨
除了 Vue3，不使用第三方依赖！ -->
## 使用
    先引入
    import { Carousel, CarouselItem } from 'carousel-q'
    import 'carousel-q/dist/style.css'
    <Carousel :options='options'>
      <CarouselItem>
        <div style="width:100%;height:100px;background-color: aqua;"></div>
      </CarouselItem>
    </Carousel>

## 默认参数
  
options: {
    "duration": 2000, 
    'autoPlay': true,
    "type": 'row',
    "indicator": true,
    "moveTime": 1000,
    'flip': true,
}
##
duration 延时
autoPlay 是否自动轮播
type 类型 （row 纵向 column 竖向）
indicator 指示器
moveTime 手动滑动延时
flip 翻页器
## 插槽
indicator 指示器
indicator 方法 参数当前页码

flip 翻页
PageUp 上一页 (返回当前页 )
PageDown 下一页(返回当前页 )