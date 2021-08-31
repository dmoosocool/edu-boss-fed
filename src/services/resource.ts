/**
 * 资源相关请求模块
 */

import request from '@/utils/request'
import type {
  IBossResponsePage,
  IBossResponse,
  IBossResponseCommonData,
} from './base.dto'
import type { AxiosPromise } from 'axios'
export interface getResourcePagesQueryDto {
  categoryId: number | null
  current: number
  name: string
  size: number
  url: string
}

export interface IResource extends IBossResponseCommonData {
  categoryId: number | null
  description: string
  id: number
  name: string
  operationId: number | null
  selected: boolean
  url: string
}

export interface allocationRoleResourcesRequest {
  roleId: number | string
  resourceIdList: number[]
}

export interface IRoleResource extends IBossResponseCommonData {
  id: number
  name: string
  operatorId: number | null
  selected: boolean
  sort: number
  resourceList: IResource[]
}
export const getResourcePages = (
  data: getResourcePagesQueryDto,
): AxiosPromise<IBossResponse<IBossResponsePage<getResourcePagesQueryDto>>> => {
  return request({
    method: 'POST',
    url: '/boss/resource/getResourcePages',
    data,
  })
}

export const getAllResources = (): AxiosPromise<IBossResponse<IResource[]>> => {
  return request({
    method: 'GET',
    url: '/boss/resource/getAll',
  })
}

export const allocateRoleResources = (
  data: allocationRoleResourcesRequest,
): AxiosPromise<IBossResponse<boolean>> => {
  return request({
    method: 'POST',
    url: '/boss/resource/allocateRoleResources',
    data,
  })
}

export const getRoleResources = (
  roleId: string | number,
): AxiosPromise<IBossResponse<IRoleResource[]>> => {
  return request({
    method: 'GET',
    url: '/boss/resource/getRoleResources',
    params: {
      roleId,
    },
  })
}
