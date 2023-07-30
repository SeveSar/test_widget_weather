import { createApp, defineCustomElement } from 'vue'
import { createPinia } from 'pinia'
import WeatherApp from './components/weather/WeatherApp.ce.vue'

import '@/assets/scss/main.scss'

import App from './App.vue'
import router from './router'

export const app = createApp(App)
app.mount('#app')

const widgetApp = defineCustomElement(WeatherApp)

customElements.define('widget-weather', widgetApp)
