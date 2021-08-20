import axios from 'axios'

import { Message } from 'element-ui'
import qs from 'qs'
import store from '@/store'
import router from '@/router'
import { IAxiosError } from '@/interfaces/page.interface'

const customRequest = axios.create({})

const redirectLogin = () => {
  router.push({
    name: 'Login',
    query: {
      redirect: router.currentRoute.fullPath,
    },
  })
}

const refreshToken = () => {
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      refreshtoken: store.state.user.refresh_token,
    }),
  })
}

let isRefreshing = false
let requests: Array<IAxiosError['request']> = []

const commonResponseErrorHanding = async (error: IAxiosError) => {
  const { status } = error.response
  const { message, request, config } = error
  switch (status) {
    case 400:
      Message.error('请求参数错误')
      break
    case 401:
      if (!store.state.user) {
        Message.warning('暂未登陆，请登陆')
        redirectLogin()
        return Promise.reject(error)
      }

      if (!isRefreshing) {
        isRefreshing = true
        try {
          const { data } = await refreshToken()
          if (!data.success) {
            redirectLogin()
            Message.warning('刷新Token失败，请重新登陆')
            return Promise.reject('刷新Token失败')
          }
          store.commit('setUser', data.content)
          requests.map(req => req && req())
          requests = []
          return customRequest(config)
        } catch (err) {
          Message.warning('登陆已过期，请重新登陆')
          store.commit('setUser', null)
          redirectLogin()
          return Promise.reject(err)
        } finally {
          isRefreshing = false
        }
      }
      return new Promise(resolve => {
        requests.push(() => {
          resolve(customRequest(error.config))
        })
      })

      break
    case 403:
      Message.error('没有权限，请联系管理员')
      break
    case 404:
      Message.error('请求资源不存在')
      break
    default:
      if (status >= 500 && status < 600) {
        Message.error('服务端错误，请联系管理员')
      } else if (request) {
        Message.error('请求超时，请刷新重试')
      } else {
        Message.error(`请求失败：${message}`)
      }
      break
  }

  return Promise.reject(error)
}

// 请求拦截器
customRequest.interceptors.request.use(
  config => {
    const { user } = store.state
    if (user && user.access_token) {
      config.headers.Authorization = user.access_token
    }
    return config
  },
  error => Promise.reject(error),
)

customRequest.interceptors.response.use(response => {
  return response
}, commonResponseErrorHanding)

export default customRequest
