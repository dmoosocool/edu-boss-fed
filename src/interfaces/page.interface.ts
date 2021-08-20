import type { AxiosResponse, AxiosRequestConfig } from 'axios'

export interface IAxiosError extends Error {
  message: string
  request?: () => void
  response: AxiosResponse
  config: AxiosRequestConfig
}

export interface Rule {
  required?: boolean
  message?: string
  trigger?: string
  pattern?: RegExp
  min?: number
  max?: number
}
