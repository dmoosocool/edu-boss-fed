export interface IFrontResponse<T> {
  success: boolean
  state: number
  message: string
  content: T
}

export interface IBossResponse<T> {
  /** 处理结果code */
  code: string
  /** 处理结果描述信息 */
  mesg: string
  /** 请求结果生成时间戳 */
  time: string
  /** 处理结果数据信息 */
  data: T
}

export interface IBossResponsePageOrder {
  column: string
  asc: boolean
}

export interface IBossResponseCommonData {
  createdBy: string
  createdTime: string
  updatedBy: string
  updatedTime: string
}

export interface IBossResponsePage<T> {
  current: number
  hitCount: boolean
  optimizeCountSql: boolean
  orders: string[]
  pages: number
  searchCount: boolean
  size: number
  total: number
  records: T[]
}

export interface TableColumnRow<T> {
  $index: number
  row: T
  store: Vue
  _self: Vue
}
