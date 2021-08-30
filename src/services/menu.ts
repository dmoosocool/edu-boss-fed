import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type { IBossResponse } from './base.dto'

export interface MenuDto {
  id?: number
  parentId: number
  name: string
  href: string
  icon?: string
  orderNum?: number
  description?: string
  shown?: boolean
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

export interface MenuInfo extends MenuDto {
  createdBy: string
  createdTime: string
  updatedBy: string
  updatedTime: string
}

export interface MenuInfoResp {
  menuInfo: MenuInfo
  parentMenuList: RoleMenu[]
}

export const createOrUpdateMenu = (
  data: MenuDto,
): AxiosPromise<IBossResponse<boolean>> => {
  return request({
    method: 'POST',
    url: '/boss/menu/saveOrUpdate',
    data,
  })
}

export const getEditMenuInfo = (
  id: string | number = -1,
): AxiosPromise<IBossResponse<MenuInfoResp>> => {
  return request({
    method: 'GET',
    url: '/boss/menu/getEditMenuInfo',
    params: {
      id,
    },
  })
}

export const getAllMenus = (): AxiosPromise<IBossResponse<MenuInfo[]>> => {
  return request({
    method: 'GET',
    url: '/boss/menu/getAll',
  })
}

export const deleteMenu = (
  id: number,
): AxiosPromise<IBossResponse<boolean>> => {
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
