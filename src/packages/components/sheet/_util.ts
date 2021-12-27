import { isObject } from "@vue/shared"

//筛选出有效的数据列
export function filterValidColumns(columns: any) {
  if (typeof columns === "function") {
    columns = columns()
  }
  let arr: any[] = []
  columns.forEach((col: any) => {
    if (!!col && isObject(col)) {
      arr.push(col)
    } else if (typeof col === "function") {
      const c = col()
      if (!!c && isObject(c)) arr.push(c)
    }
  })
  return arr
}

export function createTbodyColumns(columns: any) {
  let tbodyColumns: any[] = []
  const cols = filterValidColumns(columns)
  const fn = (arr: any) => {
    arr.forEach((col: any) => {
      if (col.children && col.children.length) {
        fn(col.children)
      } else {
        // bodyColumns.push({...col})
        tbodyColumns.push(col)
        if (col.sum !== false) {
        }
      }
    })
  }
  fn(cols)
  return tbodyColumns
}

export function getAlign(col: any) {
  const align = col.align || ""
  if (typeof align === "string") {
    return {
      thead: align,
      tbody: align,
      tfoot: align
    }
  } else {
    if (align.length) {
      let [a, b, c] = align
      return {
        thead: a || "",
        tbody: b || "",
        tfoot: c || ""
      }
    }
  }
}

export function getSelectedKey(row: any, checkboxKey: string) {
  let cks = checkboxKey
  let arrKeys: string[] = []
  if (cks.indexOf(",") > -1) {
    arrKeys = cks.split(/\s*,\s*/)
  } else {
    arrKeys.push(cks)
  }
  return arrKeys.map((k: string) => row[k]).join(",")
}
