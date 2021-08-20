import qs from 'qs'
import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type { IFrontResponse } from './base.dto'

export interface LoginUserInfo {
  portrait: string
  userName: string
}

export interface LoginForm {
  phone: string
  password: string
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
