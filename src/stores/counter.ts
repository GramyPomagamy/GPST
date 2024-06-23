import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0),
    doubleCount = computed(() => count.value * 2),
   increment = function () {
    count.value++
  }

  return { count, doubleCount, increment }
})
