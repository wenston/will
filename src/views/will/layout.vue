<template>
  <div>
    <Row :justify='"space-between"'>
      <Col :span='12'>
      <div></div>
      </Col>
      <Col :span='5'>
      <div></div>
      </Col>
      <Col :span='5'>
      <div></div>
      </Col>
    </Row>
    <div>
      <Link @click="imgViewers">
      </Link>
    </div>
    <div>
      <Dragover :dragoverClass='"dragover1"'
        clone
        :sort='false'
        :put='false'>
        <DragoverItem v-for="(item) in data"
          :key="item.id"
          :dataId='item.id'>
          <div class="t"> {{item.name}}</div>
        </DragoverItem>
      </Dragover>
      <br />
      <br />
      <Dragover :dragoverClass='"dragover2"'>
        <DragoverItem v-for="(item) in data2"
          :key="item.id"
          :dataId='item.id'>
          <div class="t"> {{item.name}}</div>
        </DragoverItem>
      </Dragover>

    </div>
    <div style="width:200px;height:100px">
      <Carousel :options='options'>
        <CarouselItem>
          <div style="width:200px;height:100px;background-color: aqua;"></div>
        </CarouselItem>
        <CarouselItem>
          <div style="width:200px;height:100px;background-color: rgb(102, 255, 0);"></div>
        </CarouselItem>
        <CarouselItem>
          <div style="width:200px;height:100px;background-color: red;"></div>
        </CarouselItem>
      </Carousel>
    </div>
    <br />
    <!-- <div style="width:200px"> -->
    <Carousel>
      <CarouselItem>
        <div style="width:100%;height:100px;background-color: aqua;"></div>
      </CarouselItem>
      <CarouselItem>
        <div style="width:100%;height:100px;background-color: rgb(102, 255, 0);"></div>
      </CarouselItem>
      <CarouselItem>
        <div style="width:100%;height:100px;background-color: red;"></div>
      </CarouselItem>
    </Carousel>
    <!-- </div> -->
    <ImgViewer :list="imgList"
      :src='src'
      v-model:show='show'></ImgViewer>

  </div>
</template>

<script  lang="ts" >
import Row from '../../packages/components/row'
import Col from '../../packages/components/col'
import Link from '../../packages/components/link'
import Dragover from '../../packages/components/dragover'
import DragoverItem from '../../packages/components/dragoverItem'
import { Carousel, CarouselItem } from 'carousel-q'
import 'carousel-q/dist/style.css'
import ImgViewer from '../../packages/components/imgViewer'
// import ImgViewer from 'img-viewer-q'
import 'img-viewer-q/dist/style.css'
import { watch, ref, defineComponent, getCurrentInstance } from 'vue'
export default defineComponent({
  components: {
    Row,
    Col,
    Link,
    Dragover,
    DragoverItem,
    Carousel,
    CarouselItem,
    ImgViewer
  },

  setup(props, ctx) {
    // console.log(imgViewer)

    const data = ref([
      { id: '1', name: '测试111111' },
      { id: '2', name: '测试222222' },
      { id: '3', name: '测试333333' },
      { id: '4', name: '测试444444' }
    ])
    const data2 = ref([
      { id: '11', name: '测试111111' },
      { id: '22', name: '测试222222' },
      { id: '33', name: '测试333333' },
      { id: '44', name: '测试444444' }
    ])
    const imgList = ref([
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1113%2F032120114622%2F200321114622-4-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647142450&t=ae3467450148171d766da827a54a7a3b',
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp08%2F01042323313046.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647142451&t=f6d3be2baecabfe96481bec50487522d'
    ])
    watch(data2, (v) => {
      console.log(v)
    })
    const options = ref({
      duration: 2000,
      autoPlay: true,
      type: 'column',
      indicator: true,
      flip: true
    })
    const index = ref(null)

    const addIndex = ref(0)

    const instance: any = getCurrentInstance()
    const imgViewer = ref(null)
    const src = ref('')
    const show = ref(false)
    function imgViewers() {
      console.log(imgViewer.value)
      src.value =
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1113%2F032120114622%2F200321114622-4-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647142450&t=ae3467450148171d766da827a54a7a3b'
      show.value = true
      // instance.refs.imgViewer.setShow(
      // 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1113%2F032120114622%2F200321114622-4-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647142450&t=ae3467450148171d766da827a54a7a3b'
      // )
    }
    return {
      data,
      data2,
      // afterDrop,
      options,
      imgList,
      imgViewer,
      imgViewers,
      src,
      show
    }
  }
})
</script>

<style lang="postcss" scoped>
.k-row {
  background: #eeeeee;
}
.k-col div {
  width: 100%;
  height: 100%;
  background-color: aqua;
}
.t {
  width: 100px;
  height: 20px;
  text-align: center;
  color: #000;

  /* cursor: move; */
}
</style>