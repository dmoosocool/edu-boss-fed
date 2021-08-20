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
