/** jsx?|tsx? file header */
import { dedupStats, formatPages } from './utils'

// 页面中的链接，锚点数据，用来全站搜索
const deduped = dedupStats()
// 包含页面创建时间，用来创建主页的 TOC
const pages = formatPages()

// 取出由 parse.py 生成的网站资源信息
export const cached = {
  pages,
  current: deduped.reduce((arr, curr) => {
    if (
      curr &&
      curr.file &&
      new RegExp(`${curr.file}$`).test(location.pathname)
    ) {
      arr.push(curr)
    }
    return arr
  }, []), // 本文
  whole: deduped // 全站
}
