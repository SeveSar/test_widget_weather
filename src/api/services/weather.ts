import type { IWeather } from '@/types/weather'
// import type { IWeatherResponse } from '../types/responses/weather'
import type { IHttpClient } from '../types/api'

export class WeatherService {
  private readonly $http: IHttpClient
  constructor(httpClient: IHttpClient) {
    this.$http = httpClient
  }

  async getWeather({ city, lat, lon }: { city?: string; lat?: number; lon?: number }) {
    const currentParams = {} as { q?: string; lat?: number; lon?: number }
    if (city) {
      currentParams.q = city
    } else {
      currentParams.lat = lat
      currentParams.lon = lon
    }

    const res = await this.$http.makeRequest<IWeather>({
      url: `weather`,
      config: {
        params: currentParams
      }
    })
    return res.data
  }
}
