<template>
  <div class="weather-settings">
    <div class="weather-settings__header">
      <h3 class="weather-settings__title">Settings</h3>
      <button class="weather-settings__close" @click.prevent="emit('toggleView', 'list')">
        <img src="@/assets/icons/close.svg" alt="" />
      </button>
    </div>
    <div class="weather-settings__list" v-if="items.length">
      <Draggable
        v-model="currentItems"
        item-key="id"
        handle=".handle"
        @start="dragging = true"
        @end="dragging = false"
      >
        <template #item="{ element }">
          <div class="weather-settings__item">
            <div class="weather-settings__item-left">
              <button class="weather-settings__item-burger handle">
                <img src="@/assets/icons/burger.svg" alt="" />
              </button>
              {{ element.name }}, {{ element.sys.country }}
            </div>
            <div class="weather-settings__item-right">
              <button
                class="weather-settings__item-trash"
                @click="emit('onRemoveItem', element.id)"
              >
                <img src="@/assets/icons/trash.svg" alt="" />
              </button>
            </div>
          </div>
        </template>
      </Draggable>
    </div>
    <span v-else>Empty list</span>
    <form class="weather-settings__add" @submit.prevent="addCity">
      <input
        type="text"
        class="weather-settings__control"
        placeholder="Type city"
        v-model="inputCity"
      />
      <button class="weather-settings__add-submit" v-if="!isLoading">
        <img src="@/assets/icons/arrow-left.svg" alt="" />
      </button>
      <AppSpinner v-else />
    </form>
  </div>
</template>

<script setup lang="ts">
import type { IWeather } from '@/types/weather'
import { useToastStore } from '@/stores/toast'
import AppSpinner from '@/components/ui/AppSpinner.vue'

import Draggable from 'vuedraggable'
import { computed, ref } from 'vue'
import { api } from '@/api/api'
interface Props {
  items: IWeather[]
}
const props = defineProps<Props>()
const emit = defineEmits(['addedCity', 'toggleView', 'onRemoveItem', 'update:items'])

const toastStore = useToastStore()
const inputCity = ref('')
const dragging = ref(false)
const isLoading = ref(false)

const addCity = async () => {
  if (!inputCity.value || isLoading.value) return
  try {
    isLoading.value = true
    const res = await api.weather.getWeather({ city: inputCity.value })

    emit('addedCity', res)
    inputCity.value = ''
  } catch (e) {
    toastStore.showToast({ type: 'error', text: 'City was not found' })

    console.log(e)
  } finally {
    isLoading.value = false
  }
}

const currentItems = computed({
  get() {
    return props.items
  },
  set(value) {
    console.log(value)
    emit('update:items', value)
  }
})
</script>

<style scoped lang="scss"></style>
