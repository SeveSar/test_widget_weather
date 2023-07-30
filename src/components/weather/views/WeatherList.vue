<template>
  <div class="weather-list">
    <WeatherCard v-for="(item, idx) in items" :key="item.id" :index="idx" :weather-item="item">
      <button
        v-if="idx === items.length - 1"
        class="weather-list__toggle weather-list__toggle"
        @click.prevent="emit('toggleView', 'settings')"
      >
        <img src="@/assets/icons/gear.svg " alt="" />
      </button>
    </WeatherCard>
    <button
      v-if="!items.length"
      class="weather-list__toggle weather-list__toggle--empty"
      @click.prevent="emit('toggleView', 'settings')"
    >
      <img src="@/assets/icons/gear.svg " alt="" />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { IWeather } from '@/types/weather'
import WeatherCard from '../WeatherCard.vue'
interface Props {
  items: IWeather[]
}
const props = defineProps<Props>()
const emit = defineEmits(['toggleView'])
</script>

<style scoped lang="scss"></style>
