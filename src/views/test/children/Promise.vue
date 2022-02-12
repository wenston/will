<template>

</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref } from 'vue'
const { name } = useRoute()
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

let arr = [1, 2, 3, 4]
let num = arr.reduce((prev, curr, curIndex, a) => {
  return prev + curr
}, -1)
console.log(num)
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