import type { Ref, ComputedRef } from 'vue'
import { computed, ref, unref, readonly } from 'vue'
//注意：date-fns里的月份也是从0开始的！
import {
  addMonths as _addMonths,
  addYears as _addYears,
  format as _format,
  getDaysInMonth as _getDaysInMonth,
  getDate as _getDate,
  getDay as _getDay,
  getMonth as _getMonth,
  getYear as _getYear,
  //date-fns里的isToday会比较时分秒！
  //   isToday as _isToday,
  isSameDay as _isSameDay,
  isSameMonth as _isSameMonth,
  parse as _parse,
  startOfMonth as _startOfMonth
} from 'date-fns'
type DateType = Date | number | string | undefined
type DateOptionType = Ref<DateType> | ComputedRef<DateType>

export default function useDate(date: DateOptionType) {
  const dayNum = 42
  const dayMap = readonly(
    new Map([
      [1, '一'],
      [2, '二'],
      [3, '三'],
      [4, '四'],
      [5, '五'],
      [6, '六'],
      [0, '日']
    ])
  )
  const currentDate = computed(() => parse(unref(date)))
  const year = computed(() => _getYear(currentDate.value))
  const month = computed(() => getMonth(currentDate.value))
  const day = computed(() => _getDate(currentDate.value))

  function addMonths(date?: DateType, n: number = 1) {
    return _addMonths(parse(date), n)
  }

  function addYears(date?: DateType, n: number = 1) {
    return _addYears(parse(date), n)
  }

  function format(date?: DateType, formart: string = 'yyyy-MM-dd') {
    return _format(parse(date || currentDate.value), formart)
  }
  /**
   * 日期月份中总共有多少天
   * @param date Date|number
   * @returns number
   */
  function getDaysInMonth(date?: DateType) {
    return _getDaysInMonth(parse(date || currentDate.value))
  }

  /**
   * getStartDayInMonth
   * 日期月份中的1号是星期几
   */
  function getStartDayInMonth(date?: DateType) {
    return _getDay(_startOfMonth(parse(date || currentDate.value)))
  }

  /**
   * getDaysInPanel
   * 下拉面板中的所有日期
   * @param date Date | number
   * @returns
   */
  function getDaysInPanel(date?: DateType) {
    const parse_date = parse(date || currentDate.value)
    const curYear = getYear(parse_date)
    const curMonth = getMonth(parse_date)
    const cur = Array.from(
      { length: getDaysInMonth(parse_date) },
      (item, index) => [curYear, curMonth, index + 1]
    )

    const d = getStartDayInMonth(parse_date)
    const prevDate = _addMonths(parse_date, -1)
    //有可能是上一年
    const prevYear = getYear(prevDate)
    const prevMonth = getMonth(prevDate)
    const nextDate = _addMonths(parse_date, 1)
    //有可能是下一年
    const nextYear = getYear(nextDate)
    const nextMonth = getMonth(nextDate)
    const prevDays = Array.from(
      { length: getDaysInMonth(prevDate) },
      (item, index) => index + 1
    )
    let _d = d - 1
    if (_d === -1) {
      _d = 6
    }
    const prev =
      _d === 0
        ? []
        : prevDays.slice(-1 * _d).map((d) => [prevYear, prevMonth, d])
    const next: number[][] = Array.from(
      { length: dayNum - cur.length - prev.length },
      (item, index) => [nextYear, nextMonth, index + 1]
    )

    return {
      prev,
      cur,
      next
    }
  }

  /**
   *
   * @param date date?:DateType
   * @returns number
   * 返回从1开始计算的月份，注意：date-fns是从0开始计算的月份！
   */
  function getMonth(date?: DateType) {
    return _getMonth(parse(date || currentDate.value)) + 1
  }

  function getYear(date?: DateType) {
    return _getYear(parse(date || currentDate.value))
  }

  function isSameDay(a: DateType, b: DateType) {
    return _isSameDay(parse(a), parse(b))
  }

  function isSameMonth(a: DateType, b: DateType) {
    return _isSameMonth(parse(a), parse(b))
  }

  function isToday(date?: DateType) {
    return _isSameDay(parse(date || currentDate.value), Date.now())
  }

  function parse(date?: DateType) {
    if (typeof date === 'string') {
      return _parse(date, 'yyyy-MM-dd', new Date())
    } else if (date === undefined) {
      return new Date()
    }
    return date
  }
  return {
    addMonths,
    addYears,
    day,
    dayMap,
    format,
    month,
    year,

    getDaysInMonth,
    getDaysInPanel,
    getStartDayInMonth,
    getMonth,
    getYear,
    isSameDay,
    isSameMonth,
    isToday,

    parse
  }
}
