import { instance } from './axios/instances'
import { AxiosHttpClient } from './axios'

import { WeatherService } from './services/weather'

const axiosHttpClient = new AxiosHttpClient(instance)

export const api = {
  weather: new WeatherService(axiosHttpClient)
}
