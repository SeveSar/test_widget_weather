import type { AxiosRequestConfig, ResponseType } from 'axios'

export interface IHttpClient {
  makeRequest: <T>(options: IOptions) => Promise<ApiResponse<T>>
}

export interface IOptions {
  url: string
  method?: 'POST' | 'GET' | 'PATCH' | 'DELETE'
  headers?: Record<string, string | number | boolean> & {
    authorization?: boolean | string
  }
  data?: any
  config?: AxiosRequestConfig
}

export interface ApiResponse<T> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string | number | boolean>
  config: AxiosRequestConfig<T>
}
