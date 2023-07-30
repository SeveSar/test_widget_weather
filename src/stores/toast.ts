import { ref, computed, watch } from 'vue'
import { defineStore, createPinia, setActivePinia } from 'pinia'

setActivePinia(createPinia())

type TypeToast = 'error' | 'info'

interface IToast {
  id: number
  text: string
  type: TypeToast
}

export const useToastStore = defineStore('toast', () => {
  let id: number = 0
  let timer: number

  const toasts = ref<IToast[]>([])

  const showToast = (toast: { type: TypeToast; text: string }) => {
    id++
    const newToast = {
      ...toast,
      id
    } as IToast
    toasts.value.push(newToast)
  }

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
    id--
  }

  watch(
    toasts,
    () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        toasts.value.shift()
      }, 2000)
    },
    { deep: true }
  )

  return {
    showToast,
    removeToast,
    toasts
  }
})
