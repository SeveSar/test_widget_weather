<template>
  <div class="app">
    <AppSpinner v-if="isLoading"></AppSpinner>
    <component
      v-else
      :is="VIEW_MAP[currentView]"
      :items="weatherData"
      @addedCity="addCity"
      @toggleView="currentView = $event"
      @onRemoveItem="removeItem"
      @update:items="updateItems"
    />
    <AppToast />
  </div>
</template>

<script setup lang="ts">
import { api } from '@/api/api'
import WeatherList from './views/WeatherList.vue'
import WeatherSettings from './views/WeatherSettings.vue'
import AppSpinner from '../ui/AppSpinner.vue'
import AppToast from '../ui/AppToast.vue'
import { useToastStore } from '@/stores/toast'
import type { IWeather } from '@/types/weather'
import getPosition from '@/utils/getCurrenLocation'
import { ref, watch, type Component } from 'vue'

type TView = 'settings' | 'list'

const VIEW_MAP: Record<TView, Component> = {
  list: WeatherList,
  settings: WeatherSettings
} as const
const toastStore = useToastStore()

const dataPosition = ref<null | { lat: number; lon: number }>(null)
const weatherData = ref<IWeather[]>(JSON.parse(localStorage.getItem('weatherData') || '[]'))
const isLoading = ref(false)
const currentView = ref<TView>('list')

const addCity = (item: IWeather) => {
  const existItem = weatherData.value.find((i) => i.id === item.id)
  if (existItem) return toastStore.showToast({ type: 'error', text: 'You already added this city' })

  weatherData.value.push(item)
  localStorage.setItem('weatherData', JSON.stringify(weatherData.value))
}

const removeItem = (id: number) => {
  weatherData.value = weatherData.value.filter((item) => item.id !== id)
  localStorage.setItem('weatherData', JSON.stringify(weatherData.value))
}

const updateItems = (items: IWeather[]) => {
  weatherData.value = items
  localStorage.setItem('weatherData', JSON.stringify(items))
}

const getUserLocation = async () => {
  try {
    const pos = await getPosition()
    dataPosition.value = pos
  } catch (e) {
    toastStore.showToast({ type: 'error', text: 'Could not get your location' })
  }
}
getUserLocation()

const fetchWeather = async () => {
  if (!dataPosition.value) return

  try {
    isLoading.value = true
    const res = await api.weather.getWeather({
      lon: dataPosition.value.lon,
      lat: dataPosition.value.lat
    })
    if (!weatherData.value.length) {
      weatherData.value = [res]
    }
  } catch (e) {
    toastStore.showToast({ type: 'error', text: 'Coud not get weather of your city' })
  } finally {
    isLoading.value = false
  }
}

watch(dataPosition, () => {
  fetchWeather()
})
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';

.weather-card {
  background-color: aliceblue;
  padding: 15px 20px;
  border-radius: 15px;
  position: relative;
  &__img {
    flex-shrink: 0;
  }

  &__icon {
    width: 15px;
    height: 15px;
  }
  &__header {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__row {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: space-between;

    &--wrap {
      flex-wrap: wrap;
    }
    &-item {
      width: calc((100% / 2) - 10px);
      flex-grow: 1;
      white-space: nowrap;
      display: flex;
      align-items: center;
      column-gap: 6px;
    }
  }

  &__extra {
    font-size: 19px;
    margin-bottom: 10px;
  }

  &__descr {
    // font-size: 20px;
    span {
      text-transform: capitalize;
    }
  }
}

.weather-list {
  position: relative;
  padding-right: 50px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;

  &__toggle {
    position: absolute;
    right: -50px;
    top: 0;
    width: 35px;
    img {
      width: 100%;
    }

    &--empty {
      position: static;
    }
  }
}

.weather-settings {
  max-width: 700px;
  width: 100%;
  img {
    width: 100%;
  }
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 25px;
  }
  &__close {
    width: 25px;
  }
  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgb(182, 177, 177);
    padding: 5px;
    margin-bottom: 15px;

    &-left {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    &-burger,
    &-trash {
      width: 35px;
      display: inline-flex;
    }
  }
  &__add {
    display: flex;
    align-items: center;
    margin-top: 25px;
    width: 100%;
    gap: 20px;

    &-submit {
      width: 40px;
    }
  }

  &__control {
    flex-grow: 1;
    min-height: 35px;
    transition: all 0.2s linear;
    border: 1px solid rgb(196, 190, 190);
    border-radius: 15px;
    padding: 10px 15px;

    &:focus {
      outline: none;
      border-color: rgb(77, 77, 163);
    }
  }
}

.toast-container {
  position: fixed;
  bottom: 30px;
  right: 20px;
  z-index: 1500;
}
.toast {
  padding: 20px;
  display: flex;
  align-items: center;
  width: max-content;
  border-radius: 4px;
  padding: 12px;
  cursor: pointer;
  margin-left: auto;

  &__text {
    font-size: 17px;
    white-space: pre-wrap;
    flex-shrink: 0;
  }

  &__icon {
    width: 30px;
    height: 30px;
    margin-right: 10px;
    flex-shrink: 0;
    color: red;
  }

  &:not(:last-child) {
    margin-bottom: 5px;
  }
  &.error {
    background-color: #dc4c64;
    color: #fcf6f5ff;
  }
  &.info {
    background-color: #3b71ca;
    color: #fcf6f5ff;
  }
}
.toast-move,
.toast-enter-active,
.toast-leave-active {
  transition: all 0.5s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.toast-leave-active {
  position: absolute;
}

.spinner {
  animation: rotate 2s linear infinite;
  z-index: 2;

  width: 55px;
  height: 55px;

  & .path {
    stroke: hsl(210, 70, 75);
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style>
