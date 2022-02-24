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
      v-model="show"></ImgViewer>
    <div id='three'></div>
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
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// import { OrbitControls } from 'three/examples/js/controls'
// import ImgViewer from 'img-viewer-q'
// import 'img-viewer-q/dist/style.css'
import {
  watch,
  ref,
  defineComponent,
  getCurrentInstance,
  onMounted,
  onUpdated
} from 'vue'
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
    console.log(THREE)
    onMounted(() => {
      // var scene = new THREE.Scene()

      // var geometry = new THREE.BoxGeometry(1, 1, 1)
      // var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      // var cube = new THREE.Mesh(geometry, material)
      // scene.add(cube)
      // // scene.add(line)

      // var camera = new THREE.PerspectiveCamera(
      //   75,
      //   window.innerWidth / window.innerHeight,
      //   0.1,
      //   1000
      // )
      // camera.position.set(0, 0, 100)
      // camera.lookAt(0, 0, 0)
      // camera.position.z = 5
      // var renderer = new THREE.WebGLRenderer()
      // renderer.setSize(window.innerWidth, window.innerHeight)
      var scene = new THREE.Scene()
      var geometry12 = new THREE.BufferGeometry() //声明一个缓冲几何体对象

      //类型数组创建顶点位置position数据
      var vertices = new Float32Array([
        0,
        0,
        0, //顶点1坐标
        50,
        0,
        0, //顶点2坐标
        0,
        100,
        0, //顶点3坐标

        0,
        0,
        10, //顶点4坐标
        0,
        0,
        100, //顶点5坐标
        50,
        0,
        10 //顶点6坐标
      ])
      // 创建属性缓冲区对象
      var attribue = new THREE.BufferAttribute(vertices, 3) //3个为一组，作为一个顶点的xyz坐标
      // 设置几何体attributes属性的位置position属性
      geometry12.attributes.position = attribue
      //类型数组创建顶点颜色color数据
      var colors = new Float32Array([
        1,
        0,
        0, //顶点1颜色
        0,
        1,
        0, //顶点2颜色
        0,
        0,
        1, //顶点3颜色

        1,
        1,
        0, //顶点4颜色
        0,
        1,
        1, //顶点5颜色
        1,
        0,
        1 //顶点6颜色
      ])
      // 设置几何体attributes属性的颜色color属性
      geometry12.attributes.color = new THREE.BufferAttribute(colors, 3) //3个为一组,表示一个顶点的颜色数据RGB
      //材质对象
      var material12 = new THREE.PointsMaterial({
        // 使用顶点颜色数据渲染模型，不需要再定义color属性
        // color: 0xff0000,
        vertexColors: THREE.VertexColors, //以顶点颜色为准
        size: 10.0 //点对象像素尺寸
      })

      // 点渲染模式  点模型对象Points
      var pointsss = new THREE.Points(geometry12, material12) //点模型对象
      scene.add(pointsss) //点对象添加到场景
      /**
       * 创建网格模型
       */
      // var geometry = new THREE.SphereGeometry(60, 40, 40); //创建一个球体几何对象
      var geometry = new THREE.BoxGeometry(100, 100, 100) //创建一个立方体几何对象Geometry

      var material = new THREE.MeshLambertMaterial({
        color: 0x0000ff
      }) //材质对象Material
      var sphereMaterial = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        specular: 0x4488ee,
        shininess: 12,
        wireframe: true
      }) //材质对象
      var mesh = new THREE.Mesh(geometry, material) //网格模型对象Mesh
      scene.add(mesh) //网格模型添加到场景中
      /**
       * 光源设置
       */
      //点光源
      var point = new THREE.PointLight(0xffffff)
      point.position.set(400, 200, 300) //点光源位置
      scene.add(point) //点光源添加到场景中
      var point2 = new THREE.PointLight(0xffffff)
      point2.position.set(-400, -200, -300) //点光源位置
      scene.add(point2) //点光源添加到场景中
      //环境光
      var ambient = new THREE.AmbientLight(0x444444)
      scene.add(ambient)
      // 球体网格模型
      var geometry2 = new THREE.SphereGeometry(60, 40, 40)
      var material2 = new THREE.MeshLambertMaterial({
        color: 0xff00ff
      })

      var mesh2 = new THREE.Mesh(geometry2, sphereMaterial) //网格模型对象Mesh
      mesh2.translateY(200) //球体网格模型沿Y轴正方向平移120
      scene.add(mesh2)
      // console.log(scene)
      // console.log(scene.children)
      var axisHelper = new THREE.AxisHelper(250)
      scene.add(axisHelper)
      /**
       * 相机设置
       */
      var width = window.innerWidth //窗口宽度
      var height = window.innerHeight //窗口高度
      var k = width / height //窗口宽高比
      var s = 200 //三维场景显示范围控制系数，系数越大，显示的范围越大
      //创建相机对象
      var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000)
      camera.position.set(200, 300, 200) //设置相机位置
      camera.lookAt(scene.position) //设置相机方向(指向的场景对象)
      /**
       * 创建渲染器对象
       */
      var renderer = new THREE.WebGLRenderer()
      renderer.setSize(800, 800) //设置渲染区域尺寸
      renderer.setClearColor(0xb9d3ff, 1) //设置背

      document.getElementById('three')?.appendChild(renderer.domElement)
      //创建控件对象
      // new OrbitControls(camera, renderer.domElement)
      //创建控件对象
      new OrbitControls(camera, renderer.domElement)

      function animate() {
        requestAnimationFrame(animate)
        // mesh.rotation.x += 0.01
        // mesh.rotation.y += 0.01
        // mesh2.rotation.x += 0.01
        mesh2.rotation.y += 0.01
        renderer.render(scene, camera)
        // renderer.vr.enabled = true
      }
      animate()
    })

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
      duration: 10000,
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
      src.value =
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1113%2F032120114622%2F200321114622-4-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647142450&t=ae3467450148171d766da827a54a7a3b'
      show.value = true
      console.log(show.value)

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