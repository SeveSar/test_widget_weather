import axios from 'axios'
import type { AxiosInstance } from 'axios'

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,

  params: {
    appid: import.meta.env.VITE_KEY,
    units: 'metric'
  }
})

export { instance }
