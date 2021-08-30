import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type { IBossResponse } from './base.dto'

export const createOrUpdateMenu = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/menu/saveOrUpdate',
    data,
  })
}

export const getEditMenuInfo = (id: string | number = -1) => {
  return request({
    method: 'GET',
    url: '/boss/menu/getEditMenuInfo',
    params: {
      id,
    },
  })
}

export const getAllMenus = () => {
  return request({
    method: 'GET',
    url: '/boss/menu/getAll',
  })
}

export const deleteMenu = (id: number) => {
  return request({
    method: 'DELETE',
    url: `/boss/menu/${id}`,
  })
}

export const getMenuNodeList = (): AxiosPromise<IBossResponse<RoleMenu[]>> => {
  return request({
    method: 'GET',
    url: '/boss/menu/getMenuNodeList',
  })
}

export const allocateRoleMenus = (data: {
  roleId: number | string
  menuIdList: number[]
}): AxiosPromise<IBossResponse<void>> => {
  return request({
    method: 'POST',
    url: '/boss/menu/allocateRoleMenus',
    data,
  })
}

export interface RoleMenu {
  createdBy: string
  createdTime: string
  description: string
  href: string
  icon: string
  id: number
  level: number
  name: string
  operatorId: number | null
  orderNum: number
  parentId: number
  selected: boolean
  shown: boolean
  updatedBy: string
  updatedTime: string
  subMenuList: Array<RoleMenu> | null
}

export const getRoleMenus = (
  roleId: string | number,
): AxiosPromise<IBossResponse<RoleMenu[]>> => {
  return request({
    method: 'GET',
    url: '/boss/menu/getRoleMenus',
    params: {
      // axios 会把 params 转换为 key=value&key=value 的数据格式放到 url 后面(以?分割)
      roleId,
    },
  })
}
