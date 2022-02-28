<template>
<input v-model="v" />
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
const { name } = useRoute()
const v = ref('')

function onInput(e:Event) {
  const _v = (e.target as HTMLInputElement).value
  v.value = _v
  console.log(_v)
}


const k1 = [...new Array(11).keys()]
const k2 = Array.from({length:11},(item,index)=>index)
const k3 = Array.apply(null,Array(11)).map((item,index)=>index)

console.log('k1:',k1)
console.log('k2:',k2)
console.log('k3:',k3)

const promise = new Promise(function (resolve, reject) {
  // throw new Error('test')
  setTimeout(() => {
    resolve('成功了')
  }, 1000)
})
promise
  .then(
    () => {
      console.log(promise)
    },
    (err) => {
      console.log('错误了', err)
    }
  )
  .then()
  .catch(function (error) {
    console.log(error)
  })

const fn = (key: string) =>
  key.split('.').reduce(
    (o: Record<any, any>, i) => {
      console.log(i)
      if (o) {
        return o[i]
      }
    },
    {
      greetings: {
        hello: 'Bonjour'
      }
    }
  )

console.log(fn('greetings.hello'))

// let arr = [1, 2, 3, 4]
// let num = arr.reduce((prev, curr, curIndex, a) => {
//   return prev + curr
// }, -1)
// console.log(num)
/**
 * 以下的打印顺序是为什么？
 * https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_DOM_API/Microtask_guide
 */
/* Promise.resolve()
  .then(() => {
    console.log(0)
    return Promise.resolve(4)
  })
  .then((res) => {
    console.log(res)
  })

Promise.resolve()
  .then(() => {
    console.log(1)
  })
  .then(() => {
    console.log(2)
  })
  .then(() => {
    console.log(3)
  })
  .then(() => {
    console.log(5)
  })
  .then(() => {
    console.log(6)
  }) */
</script>

<style lang="postcss" module="css">
.text {
  width: 100px;
  height: 30px;}
</style>
