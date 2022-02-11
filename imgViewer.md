## 简单的图片预览器
## 使用
    先引入
    import imgViewer from 'img-viewer-q'
    import 'img-viewer-q/dist/style.css'
     <ImgViewer :list="list"
      :src='src'
      v-model:show='show'></ImgViewer>

## 参数
  list 当前图片列表
  src 选中的图片地址
  show 是否显示图片预览器
