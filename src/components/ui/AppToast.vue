<template>
  <div class="toast-container">
    <transition-group name="toast">
      <div
        class="toast"
        v-for="item in toastStore.toasts"
        :class="item.type"
        :key="item.id"
        @click="toastStore.removeToast(item.id)"
      >
        <div class="toast__text">
          {{ item.text }}
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script lang="ts" setup>
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()
</script>

<style lang="scss"></style>
