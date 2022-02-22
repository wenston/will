import { computed, defineComponent, ref, getCurrentInstance, defineExpose, watch, onUnmounted } from 'vue'
import Icon from '../icon/index'
export default defineComponent({
  inheritAttrs: false,
  props: {
    list: {
      type: Array,
      default: () => []
    },
    src: {
      type: String,
      default: ""
    },
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: 'modelValue',
    event: "update:modelValue"
  },
  emits: ['update:modelValue'],
  components: {
    Icon
  },

  setup(props, ctx) {
    const show = ref(false)
    const cSrc: any = ref("") //当前显示的图
    const style = ref("")
    const instance: any = getCurrentInstance()

    //   放大
    const enlargeStyle = ref(1)
    const width = ref(0)
    const height = ref(0)
    function setStyle() {
      let w = 0
      let h = 0
      if (width.value) {
        w = width.value * enlargeStyle.value
        h = height.value * enlargeStyle.value
      } else {
        w = instance?.refs.contentImg.clientWidth * enlargeStyle.value
        h = instance?.refs.contentImg.clientHeight * enlargeStyle.value
        width.value = instance?.refs.contentImg.clientWidth
        height.value = instance?.refs.contentImg.clientHeight
      }

      style.value = `width:${w}px;max-width:${w}px;height:${h}px;max-height:${h}px;`
    }
    function enlarge() {
      enlargeStyle.value += 1
      setStyle()
      // enlargeStyle.value =
    }
    //   缩小
    function narrow() {
      if (enlargeStyle.value > 1) {
        enlargeStyle.value -= 1
      } else if (enlargeStyle.value > 0) {
        enlargeStyle.value -= 0.2
      }
      if (enlargeStyle.value > 0) {
        setStyle()
      }
    }
    function wheel(event: any) {
      var delta = 0
      if (!event) event = window.event
      if (event.wheelDelta) {
        // IE、chrome浏览器使用的是wheelDelta，并且值为“正负120”
        delta = event.wheelDelta / 120
        delta = event.wheelDelta
        // if (window.opera) delta = -delta //因为IE、chrome等向下滚动是负值，FF是正值，为了处理一致性，在此取反处理
      } else if (event.detail) {
        // FF浏览器使用的是detail,其值为“正负3”
        delta = -event.detail / 3
        // delta = event.wheelDelta
      }
      if (delta) handle(delta, event)
    }
    function getClose(e: any) {
      if (e.key == "Escape") {
        close()
      }
      e.stopPropagation()
    }
    // 设置当前显示图片 和 弹出


    // 关闭
    function close() {
      console.log(ctx);

      window.removeEventListener("DOMMouseScroll", wheel, false)
      document.body.removeEventListener("keyup", getClose, false)
      // window.onwheel = document.onwheel = null //W3C
      show.value = false
      ctx.emit('update:modelValue', false);
    }

    function selImg(item: any): void {
      cSrc.value = item
    }
    // 拖动
    function startFn(ev: any) {
      ev.preventDefault()
      let disX = ev.clientX - instance?.refs.contentImg.offsetLeft
      let disY = ev.clientY - instance?.refs.contentImg.offsetTop
      document.onmousemove = function (e) {
        var x = e.clientX
        var y = e.clientY
        // 一定要给left和top添加px单位
        instance.refs.contentImg.style.left = x - disX + "px"
        instance.refs.contentImg.style.top = y - disY + "px"
        e.preventDefault()
      }
      document.onmouseup = function () {
        document.onmousemove = null
      }
    }
    function end() {
      document.onmousemove = null
    }
    // 全屏 判断各种浏览器，找到正确的方法
    function launchFullscreen() {
      let element = instance?.refs.viewer
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen()
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen()
      }
    }
    // 上一个
    function pageUp() {
      let i = props.list.indexOf(cSrc.value)
      if (i > 0) {
        i--
        cSrc.value = props.list[i]
      }
    }
    // 下一个
    function pageDow() {
      let i = props.list.indexOf(cSrc.value)
      if (i < props.list.length - 1) {
        i++
        cSrc.value = props.list[i]
      }
    }
    // 刷新
    function refresh() {
      style.value = ""
      instance.refs.contentImg.style.left = "50%"
      instance.refs.contentImg.style.top = "50%"
      instance.refs.contentImg.style.transform = "translate(-50%,-50%)"
    }
    //   旋转
    const count = ref(0)
    function rotate(i: any): void {
      if (i == 2) {
        if (count.value < 270) {
          count.value += 90
        } else {
          count.value = 0
        }
      } else {
        if (Math.abs(count.value) < 270) {
          count.value -= 90
        } else {
          count.value = 0
        }
      }
      let width = instance?.refs.contentImg.clientWidth
      let height = instance?.refs.contentImg.clientHeight
      instance.refs.contentImg.style.transform = `translateX(-${width / 2
        }px) translateY(-${height / 2}px) rotate(${count.value}deg)`
    }

    //兼容性写法，该函数也是网上别人写的，不过找不到出处了，蛮好的，所有我也没有必要修改了
    //判断鼠标滚轮滚动方向

    //上下滚动时的具体处理函数
    function handle(delta: any, ev: any) {
      if (delta < 0) {
        enlargeStyle.value = 0.5
        setStyle()
        //向下滚动
        // let disX = ev.clientX - instance?.refs.contentImg.offsetLeft
        // let disY = ev.clientY - instance?.refs.contentImg.offsetTop
        // instance.refs.contentImg.style.left = disX + "px"
        // instance.refs.contentImg.style.top = disY + "px"
      } else {
        //向上滚动
        enlargeStyle.value = 2
        setStyle()
        let disX = ev.clientX
        let disY = ev.clientY
        instance.refs.contentImg.style.left = disX + "px"
        instance.refs.contentImg.style.top = disY + "px"
      }

    }
    const foot = computed(() => {
      if (props.list) {
        return props.list.map((item: any) => {
          return (<img
            src={item}
            onClick={() => selImg(item)}
          />)
        })
      } else {
        return []
      }
    })
    watch(() => props.modelValue, (v) => {
      console.log(v);

      try {
        if (v) {
          show.value = true
          cSrc.value = props.src
          if (window.addEventListener) {
            // FF,火狐浏览器会识别该方法
            window.addEventListener("DOMMouseScroll", wheel, false)
            // window.onwheel = document.onwheel = wheel //W3C

            document.body.addEventListener("keyup", getClose)
            // 统一处理滚轮滚动事件
          }
        }
        // else {
        //   ctx.emit('update:modelValue', false)
        // }
      } catch (error) {
        console.error(error);

      }


    })
    const content = computed(() => {
      if (show.value) {
        return (
          <div class='imgViewer' onMouseup={end} ref="viewer">
            <div class="viewer-close" onClick={close}>
              <Icon class="close"
                size="30px"
                name="icon-close-bold"></Icon>
            </div>
            <div class="viewer-mask"></div>
            <div class="imgBox">
              <div class="content">
                <img ref="contentImg"
                  src={cSrc.value}
                  draggable={false}
                  onMousedown={startFn}
                  style={style.value}
                  alt="" />
                <div class="toolbar">
                  <div class="toolbar-item"
                    onClick={enlarge}>
                    <Icon name="icon-fangda"></Icon>
                  </div>
                  <div class="toolbar-item"
                    onClick={narrow}>
                    <Icon name="icon-suoxiao"></Icon>
                  </div>
                  <div class="toolbar-item"
                    onClick={pageUp}>
                    <Icon name="icon-arrow-left-bold"></Icon>
                  </div>
                  <div class="toolbar-item">
                    {props.list.indexOf(cSrc.value) + 1}/{props.list.length}
                  </div>
                  <div class="toolbar-item"
                    onClick={pageDow}>
                    <Icon name="icon-arrow-right-bold"></Icon>
                  </div>

                  <div onClick={launchFullscreen}
                    class="toolbar-item toolbar-item2">
                    <Icon name="icon-quanping"></Icon>
                  </div>
                  <div class="toolbar-item"
                    onClick={refresh}>
                    <Icon name="icon-shuaxin"></Icon>
                  </div>
                  <div class="toolbar-item"
                    onClick={() => rotate(1)}>
                    <Icon name="icon-xiangyouxuanzhuan"></Icon>
                  </div>

                  <div class="toolbar-item toolbar-item_right"
                    onClick={() => rotate(2)}>
                    <Icon name="icon-xiangzuoxuanzhuan"></Icon>
                  </div>
                </div>
              </div>

              <div class="foot">
                {foot.value}
              </div>
            </div>
          </div>
        )
      } else {
        return ''
      }
    })
    onUnmounted(() => {
      ctx.emit('update:modelValue', false);
    })
    return () => (
      // <transition>
      content.value
      // </transition>
    )
  }
})