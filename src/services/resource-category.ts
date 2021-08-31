/**
 * 资源分类相关请求模块
 */

import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type { IBossResponse, IBossResponseCommonData } from './base.dto'
import { IResource } from './resource'

export interface ResourceCategory extends IBossResponseCommonData {
  id: number
  name: string
  operatorId: number | null
  selected: boolean
  sort: number
  children: Array<IResource>
}

export const getResourceCategories = (): AxiosPromise<
  IBossResponse<ResourceCategory[]>
> => {
  return request({
    method: 'GET',
    url: '/boss/resource/category/getAll',
  })
}
