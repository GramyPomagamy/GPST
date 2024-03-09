<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Ref } from 'vue'

import axios from 'axios'

const inputBackground: Ref<HTMLInputElement | null> = ref(null)
const inputRunner = ref('')
const inputTitle = ref('')
const inputSubtitle = ref('')
const inputCategory = ref('')
const inputMoney = ref(0)

const props = defineProps<{
  runner: string
  title: string
  subtitle: string
  category: string
  money: number
}>()

const emit = defineEmits<{
  updateBackground: [b: string]
  updateRunner: [r: string]
  updateTitle: [t: string]
  updateSubtitle: [s: string]
  updateCategory: [c: string]
  updateMoney: [m: number]
}>()

if (props.runner) {
  inputRunner.value = props.runner
  emit('updateRunner', props.runner)
}
if (props.title) {
  inputTitle.value = props.title
  emit('updateTitle', inputTitle.value)
}
if (props.subtitle) {
  inputSubtitle.value = props.subtitle
  emit('updateSubtitle', props.subtitle)
}
if (props.category) {
  inputCategory.value = props.category
  emit('updateCategory', props.category)
}
if (props.money) {
  inputMoney.value = props.money
  emit('updateMoney', props.money)
}

// if (inputMoney.value <= 0) {
//   updateMoney()
// }

function onNewBackground() {
  console.log(inputBackground.value!.files![0])
  let reader = new FileReader()
  reader.onloadend = function () {
    emit('updateBackground', reader.result as string)
  }
  reader.readAsDataURL(inputBackground.value!.files![0])
}

watch(inputRunner, () => {
  emit('updateRunner', inputRunner.value.trim())
})
watch(inputTitle, () => {
  emit('updateTitle', inputTitle.value.trim())
})
watch(inputSubtitle, () => {
  emit('updateSubtitle', inputSubtitle.value.trim())
})
watch(inputCategory, () => {
  emit('updateCategory', inputCategory.value.trim())
})
watch(inputMoney, () => {
  emit('updateMoney', inputMoney.value)
})

function updateMoney() {
  axios.get('https://gsps.pl/donacje/index/gspsdzieciom2024?json=gpst').then((resp) => {
    inputMoney.value = Number(resp.data.agg.amount)
  })
}
</script>

<template>
  <div>
    <div>
      <label for="background">Tło:</label>
      <input
        ref="inputBackground"
        @change="onNewBackground"
        type="file"
        name="background"
        id="background"
        accept="image/png, image/jpeg, image/bmp"
      />
    </div>
    <div>
      <label for="runner">Runner:</label>
      <input
        v-model="inputRunner"
        type="text"
        name="runner"
        id="runner"
        placeholder="Runner"
        size="42"
        required
      />
    </div>
    <div>
      <label for="title">Tytuł:</label>
      <input
        v-model="inputTitle"
        type="text"
        name="title"
        id="title"
        placeholder="Tytuł"
        size="42"
        required
      />
    </div>
    <div>
      <label for="subtitle">Podtytuł:</label>
      <input
        v-model="inputSubtitle"
        type="text"
        name="subtitle"
        id="subtitle"
        size="42"
        placeholder="Podtytuł (opcjonalne)"
      />
    </div>
    <div>
      <label for="category">Kategoria:</label>
      <input
        v-model="inputCategory"
        type="text"
        name="category"
        id="category"
        placeholder="Kategoria"
        size="42"
        required
      />
    </div>
    <div>
      <label for="money">Uzbierano:</label>
      <input
        v-model="inputMoney"
        type="number"
        name="money"
        id="money"
        placeholder="0"
        size="10"
        required
      />
      <!-- TODO update from the internet -->
      <button type="button" @click.prevent="updateMoney">Aktualizuj</button>
    </div>
  </div>
</template>
