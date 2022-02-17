<template></template>
<script lang="ts" setup>
function checkByRegExp(reg: RegExp) {
  return (str: string) => reg.test(str)
}
const check = (reg: RegExp) => (str: string) => reg.test(str)
const checkPhone = checkByRegExp(/^1\d{10}$/)
const checkEmail = checkByRegExp(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/)

// function curry(fn: Function) {
//   return _curry.call(this, fn, fn.length)
// }
// function _curry(fn: Function, len: number, ...arg: any[]) {
//   return function (...params: any[]) {
//     let arr = [...arg, ...params]
//     if (arr.length >= len) {
//       return fn.apply(this, arr)
//     } else {
//       return _curry.call(this, fn, len, ...arr)
//     }
//   }
// }

function curry<T>(fn: Function) {
  return _curry<T>(fn, fn.length)

  function _curry<T>(fn: Function, len: number, ...args: T[]) {
    return function (...params: T[]) {
      let arr = [...args, ...params]
      if (arr.length >= len) {
        return fn(...arr)
      } else {
        return _curry(fn, len, ...arr)
      }
    }
  }
}

const fn = curry<number>(function (a: any, b: any, c: any, d: any, e: any) {
  return a + b + c + d + e
})
// fn(1, 2, 3, 4, 5)
// fn(1, 2)(3)(4, 5)
const fn2 = curry<string>(function (a: string, b: string, c: string) {
  let o = {
    a,
    b,
    c,
    join() {
      return [this.a, this.b, this.c].join(',')
    }
  }
  console.log(o.join())
})

const namelist1 = [
  { mid: '哈傻k', profession: '中单' },
  { mid: '沙皇', profession: '中单' },
  { mid: '卡牌', profession: '中单' },
  { mid: '发条', profession: '中单' }
]
const namelist2 = [
  { adc: '轮子妈', profession: 'ADC' },
  { adc: 'VN', profession: 'ADC' },
  { adc: '老鼠', profession: 'ADC' }
]

const c = (key: string) => (obj: Record<any, any>) => obj[key]
const getMid = c('mid')
const getAbc = c('adc')
</script>
