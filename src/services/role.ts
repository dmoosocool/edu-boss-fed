/**
 * 角色相关请求模块
 */

import request from '@/utils/request'
import type { IBossResponse, IBossResponsePageOrder } from './base.dto'
import type { AxiosPromise } from 'axios'

export interface getRolesParameter {
  current: number
  size: number
  name: string
}

export interface RoleRecord {
  /** 角色编码 */
  code: string
  /** 主键ID */
  id: number
  /** 角色名称 */
  name: string
  /** 创建人 */
  createdBy: string
  /** 角色描述 */
  description: string
  /** 更新人 */
  updatedBy: string
  /** 创建时间 */
  createdTime: string
  /** 更新时间 */
  updatedTime: string
  /** 操作人ID */
  operatorId: number
}

export interface getRolesResponse {
  pages: number
  searchCount: boolean
  total: number
  size: number
  current: number
  optimizeCountSql: boolean
  hitCount: boolean
  records: Array<RoleRecord>
  orders: Array<IBossResponsePageOrder>
}

export interface updateRoleParameter {
  id?: number
  code: string
  name: string
  description?: string
}

export const getRoles = (
  data: getRolesParameter,
): AxiosPromise<IBossResponse<getRolesResponse>> => {
  return request({
    method: 'POST',
    url: '/boss/role/getRolePages',
    data,
  })
}

export const deleteRole = (
  id: string | number,
): AxiosPromise<IBossResponse<boolean>> => {
  return request({
    method: 'DELETE',
    url: `/boss/role/${id}`,
  })
}

export const createOrUpdate = (
  data: updateRoleParameter,
): AxiosPromise<IBossResponse<boolean>> => {
  return request({
    method: 'POST',
    url: '/boss/role/saveOrUpdate',
    data,
  })
}

export const getRoleById = (
  id: string | number,
): AxiosPromise<IBossResponse<RoleRecord>> => {
  return request({
    method: 'GET',
    url: `/boss/role/${id}`,
  })
}

// export const getAllRoles = () => {
//   return request({
//     method: 'GET',
//     url: '/boss/role/all',
//   })
// }

// export const allocateUserRoles = (data: any) => {
//   return request({
//     method: 'POST',
//     url: '/boss/role/allocateUserRoles',
//     data,
//   })
// }

// export const getUserRoles = (userId: string | number) => {
//   return request({
//     method: 'GET',
//     url: `/boss/role/user/${userId}`,
//   })
// }
