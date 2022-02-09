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
      <Link>

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
  </div>
</template>

<script  lang="ts" >
import Row from '../../packages/components/row'
import Col from '../../packages/components/col'
import Link from '../../packages/components/link'
import Dragover from '../../packages/components/dragover'
import DragoverItem from '../../packages/components/dragoverItem'
import { Carousel, CarouselItem } from '../../packages/components/carousel'
// import { watch } from '@vue/runtime-core'
import { watch, ref, defineComponent } from 'vue'
// const DragoverItem = Dragover.item
export default defineComponent({
  components: {
    Row,
    Col,
    Link,
    Dragover,
    DragoverItem,
    Carousel,
    CarouselItem
  },

  setup(props, ctx) {
    console.log(CarouselItem)
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

    function move2(v) {
      let it = data.value[v]
      data2.value.splice(addIndex.value, 0, it)
    }
    // function afterDrop(data) {
    //   if (data2.value.length) {
    //     if (index.value != null) {
    //       data2.value.splice(index.value, 0, data)
    //       index.value = null
    //     } else {
    //       data2.value.push(data)
    //     }
    //   } else {
    //     data2.value.push(data)
    //   }
    // }

    function update1({ to, from }) {
      console.log(to, from)

      let it = data.value.splice(to, 1)[0]
      data.value.splice(from, 0, it)
    }
    function update({ to, from }) {
      let it = data2.value.splice(to, 1)[0]
      data2.value.splice(from, 0, it)
      console.log(data2.value, 'data2')
    }
    const addIndex = ref(0)
    function add(index) {
      addIndex.value = index
      console.log(index, 'index')
    }
    return {
      data,
      data2,
      // afterDrop,
      move2,
      add,
      update1,
      update,
      options
    }
  }
})
</script>

<style>
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