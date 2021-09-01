import qs from 'qs'
import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type {
  IBossResponse,
  IBossResponsePage,
  IFrontResponse,
} from './base.dto'

export interface LoginUserInfo {
  portrait: string
  userName: string
}

export interface LoginForm {
  phone: string
  password: string
}

export interface IUserPagesRequest {
  currentPage?: number
  pageSize?: number
  phone?: string
  userId?: number
  startCreateTime?: string
  endCreateTime?: string
}

export interface IUser {
  id: number
  isDel: boolean
  name: string
  password: string
  phone: string
  portrait: string | null
  regIp: string | null
  status: string
  description: string
  operatorId: number
  createdTime: string
  updatedTime: string
}

export const login = (
  data: LoginForm,
): AxiosPromise<IFrontResponse<string>> => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    data: qs.stringify(data),
  })
}

export const getUserInfo = (): AxiosPromise<IFrontResponse<LoginUserInfo>> => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo',
  })
}

export const getUserPages = (
  data: IUserPagesRequest,
): AxiosPromise<IBossResponse<IBossResponsePage<IUser>>> => {
  return request({
    method: 'POST',
    url: '/boss/user/getUserPages',
    data,
  })
}

export const forbidUser = (userId: string | number) => {
  return request({
    method: 'POST',
    url: '/boss/user/forbidUser',
    params: {
      userId,
    },
  })
}
